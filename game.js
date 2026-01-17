
// 游戏核心逻辑 - 手机竖屏优化版
class GameCore {
    constructor() {
        // 游戏配置
        this.GRID_SIZE = 15;
        this.CELL_SIZE = 0;
        this.COLORS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'white'];
        
        // 设备检测
        this.isMobile = this.detectMobile();
        
        // 根据设备调整速度
        if (this.isMobile) {
            this.PROJECTILE_SPEED = 4; // 移动设备减慢
            this.EXPLOSION_PROJECTILE_SPEED = 4;
        } else {
            this.PROJECTILE_SPEED = 5; // 桌面正常速度
            this.EXPLOSION_PROJECTILE_SPEED = 5;
        }
        
        // 游戏状态
        this.state = {
            score: 0,
            combo: 0,
            active: false,
            lives: 3,
            ammo: 100,
            money: 0,
            level: 1,
            hasTreasure: false,
            hasFlag: false,
            nextColor: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
            projectiles: [],
            explosions: [],
            maze: [],
            specialCells: {
                bombs: [],
                treasure: null,
                flag: null
            },
            isMouseDown: false,
            shootInterval: null,
            lastShootTime: 0,
            shootDelay: this.isMobile ? 250 : 150, // 移动设备延迟更长
            whiteChance: 0,
            splitCount: 1,
            splitDirections: 3,
            scoreMultiplier: 1.0,
            bombImmunity: 0,
            bombImmunityUsed: 0,
            infiniteAmmo: false,
            infiniteLife: false,
            rapidFire: false,
            whitePowerful: false,
            moneyMultiplier: 1.0,
            chestCollected: false
        };
        
        // 游戏循环控制
        this.gameLoopId = null;
        this.isGameLoopRunning = false;
        this.lastFrameTime = 0;
        this.targetFPS = this.isMobile ? 30 : 60; // 移动设备帧率优化
        
        // DOM元素引用
        this.elements = {
            grid: null,
            gridContainer: null,
            score: null,
            lives: null,
            ammo: null,
            money: null,
            currentLevel: null,
            scoreRequirement: null
        };
        
        // 初始化
        this.initElements();
    }
    
    // 检测移动设备
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (window.innerWidth <= 768);
    }
    
    // 初始化DOM元素引用
    initElements() {
        this.elements.grid = document.getElementById('grid');
        this.elements.gridContainer = document.getElementById('gridContainer');
        this.elements.score = document.getElementById('score');
        this.elements.lives = document.getElementById('lives');
        this.elements.ammo = document.getElementById('ammo');
        this.elements.money = document.getElementById('money');
        this.elements.currentLevel = document.getElementById('currentLevel');
        this.elements.scoreRequirement = document.getElementById('scoreRequirement');
    }
    
    startNewGame() {
        console.log('开始新游戏，设备:', this.isMobile ? '移动设备' : '桌面设备');
        
        // 停止之前的游戏循环
        this.stopGameLoop();
        
        // 重置游戏状态，包括金钱
        this.resetGameState(true);
        
        // 确保游戏处于活跃状态
        this.state.active = true;
        
        // 开始游戏循环（确保只启动一次）
        if (!this.isGameLoopRunning) {
            this.gameLoop();
        }
        
        // 播放游戏背景音乐
        audioManager.playBGM('game');
    }
    
    // 停止游戏循环
    stopGameLoop() {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
        this.isGameLoopRunning = false;
        this.lastFrameTime = 0;
    }
    
    resetGameState(resetMoney = false) {
        const levelInfo = levelSystem.getLevelDisplayInfo();
        
        // 计算金钱
        const money = resetMoney ? 0 : (this.state && this.state.money ? this.state.money : 0);
        
        // 根据设备重新设置速度
        if (this.isMobile) {
            this.PROJECTILE_SPEED = 4;
            this.EXPLOSION_PROJECTILE_SPEED = 4;
        } else {
            this.PROJECTILE_SPEED = 5;
            this.EXPLOSION_PROJECTILE_SPEED = 5;
        }
        
        this.state = {
            score: 0,
            combo: 0,
            active: true,
            lives: 3,
            ammo: this.isMobile ? 120 : 100, // 移动设备多给弹药
            money: money,
            level: levelInfo.number,
            hasTreasure: false,
            hasFlag: false,
            nextColor: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
            projectiles: [],
            explosions: [],
            maze: [],
            specialCells: {
                bombs: [],
                treasure: null,
                flag: null
            },
            isMouseDown: false,
            shootInterval: null,
            lastShootTime: 0,
            shootDelay: this.isMobile ? 250 : 150,
            whiteChance: 0,
            splitCount: 1,
            splitDirections: 3,
            scoreMultiplier: 1.0,
            bombImmunity: 0,
            bombImmunityUsed: 0,
            infiniteAmmo: false,
            infiniteLife: false,
            rapidFire: false,
            whitePowerful: false,
            moneyMultiplier: 1.0,
            chestCollected: false
        };
        
        // 更新关卡显示
        this.elements.currentLevel.textContent = `关卡: ${levelInfo.number}`;
        this.elements.scoreRequirement.textContent = `目标: ${levelInfo.scoreReq}分`;
        
        // 重新计算网格大小
        this.GRID_SIZE = levelInfo.gridSize;
        
        // 创建网格
        this.createGrid();
        this.calculateCellSize();
        
        // 生成迷宫
        this.generateMaze();
        
        // 更新发射台颜色
        this.updateLauncherColor();
        
        // 应用商店道具效果
        this.applyShopEffects();
        
        // 更新UI显示
        this.updateUI();
    }
    
    // 应用商店道具效果
    applyShopEffects() {
        const effects = shopSystem.getItemEffects();
        
        console.log('应用道具效果，弹药加成:', effects.ammoBonus);
        
        // 弹药加成 - 在初始弹药基础上增加
        const baseAmmo = this.isMobile ? 120 : 100;
        const totalAmmo = baseAmmo + effects.ammoBonus;
        this.state.ammo = totalAmmo;
        
        // 炸弹免疫
        this.state.bombImmunity = effects.bombImmunity;
        this.state.bombImmunityUsed = 0;
        
        // 白色子弹概率
        this.state.whiteChance = effects.whiteChance;
        
        // 白色子弹强化
        this.state.whitePowerful = effects.whitePowerful;
        
        // 分裂效果
        this.state.splitCount = Math.max(1, effects.splitCount);
        this.state.splitDirections = Math.min(8, effects.splitDirections);
        
        // 特殊能力
        this.state.infiniteAmmo = effects.infiniteAmmo;
        this.state.infiniteLife = effects.infiniteLife;
        this.state.rapidFire = effects.rapidFire;
        if (this.state.rapidFire) {
            this.state.shootDelay = this.isMobile ? 150 : 100;
        } else {
            this.state.shootDelay = this.isMobile ? 250 : 150;
        }
        
        // 经济效果
        this.state.scoreMultiplier = Math.max(1.0, effects.scoreMultiplier);
        this.state.moneyMultiplier = Math.max(1.0, effects.moneyMultiplier);
        
        // 如果有无限制药，设置弹药为999
        if (this.state.infiniteAmmo) {
            this.state.ammo = 999;
        }
        
        console.log('最终弹药值:', this.state.ammo);
    }

    // 显示道具效果提示
    showItemEffectMessage(itemName) {
        const message = document.createElement('div');
        message.className = 'item-effect-message';
        message.innerHTML = `<i class="fas fa-check-circle"></i> ${itemName} 效果已激活！`;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: #0ff;
            padding: ${this.isMobile ? '12px 20px' : '15px 30px'};
            border-radius: ${this.isMobile ? '8px' : '10px'};
            border: 2px solid #0ff;
            z-index: 1000;
            font-size: ${this.isMobile ? '16px' : '20px'};
            font-weight: bold;
            box-shadow: 0 0 20px #0ff;
            animation: fadeInOut 2s ease-in-out;
            text-align: center;
        `;
        
        document.body.appendChild(message);
        
        // 2秒后移除
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 2000);
    }
    
    // 创建网格
    createGrid() {
        const grid = this.elements.grid;
        grid.innerHTML = '';
        
        // 设置网格模板
        grid.style.gridTemplateColumns = `repeat(${this.GRID_SIZE}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${this.GRID_SIZE}, 1fr)`;
        
        // 创建网格单元格
        for (let y = 0; y < this.GRID_SIZE; y++) {
            this.state.maze[y] = [];
            for (let x = 0; x < this.GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // 优化触摸体验
                if (this.isMobile) {
                    cell.style.touchAction = 'none';
                }
                
                // 添加事件监听
                this.addCellEvents(cell, x, y);
                
                grid.appendChild(cell);
                this.state.maze[y][x] = { type: 'empty', element: cell };
            }
        }
        
        // 放置发射台（在底部中间）
        const launcherX = Math.floor(this.GRID_SIZE / 2);
        const launcherY = this.GRID_SIZE - 1;
        const launcherCell = this.state.maze[launcherY][launcherX].element;
        launcherCell.className = 'cell launcher';
        this.state.maze[launcherY][launcherX].type = 'launcher';
    }
    
    // 添加单元格事件（优化移动设备触摸）
    addCellEvents(cell, x, y) {
        // 移动设备触摸事件
        if (this.isMobile) {
            // 触摸开始
            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.state.active) return;
                
                this.state.isMouseDown = true;
                this.shootAt(x, y);
                this.startAutoShoot(x, y);
            }, { passive: false });
            
            // 触摸移动（拖拽射击）
            cell.addEventListener('touchmove', (e) => {
                if (!this.state.active || !this.state.isMouseDown || e.touches.length === 0) return;
                
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.elements.grid.getBoundingClientRect();
                
                // 计算触摸位置对应的网格坐标
                const touchX = touch.clientX - rect.left;
                const touchY = touch.clientY - rect.top;
                
                // 转换为网格坐标
                const cellX = Math.floor(touchX / this.CELL_SIZE);
                const cellY = Math.floor(touchY / this.CELL_SIZE);
                
                // 确保在网格范围内且不是发射台
                if (cellX >= 0 && cellX < this.GRID_SIZE && 
                    cellY >= 0 && cellY < this.GRID_SIZE &&
                    !(cellX === Math.floor(this.GRID_SIZE / 2) && cellY === this.GRID_SIZE - 1)) {
                    this.shootAt(cellX, cellY);
                }
            }, { passive: false });
            
            // 触摸结束
            cell.addEventListener('touchend', () => {
                this.state.isMouseDown = false;
                this.stopAutoShoot();
            });
            
            cell.addEventListener('touchcancel', () => {
                this.state.isMouseDown = false;
                this.stopAutoShoot();
            });
        }
        
        // 桌面鼠标事件
        cell.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (!this.state.active) return;
            this.state.isMouseDown = true;
            this.shootAt(x, y);
            this.startAutoShoot(x, y);
        });
        
        cell.addEventListener('mouseup', () => {
            this.state.isMouseDown = false;
            this.stopAutoShoot();
        });
        
        cell.addEventListener('mouseleave', () => {
            if (this.state.isMouseDown) {
                this.state.isMouseDown = false;
                this.stopAutoShoot();
            }
        });
    }
    
    // 计算单元格大小（适配手机竖屏）
    calculateCellSize() {
        const gridContainer = this.elements.gridContainer;
        if (gridContainer && gridContainer.clientWidth > 0) {
            // 获取容器实际可用大小
            const containerWidth = gridContainer.clientWidth;
            const containerHeight = gridContainer.clientHeight || containerWidth; // 确保正方形
            
            // 使用较小的边长以确保完全显示
            const minDimension = Math.min(containerWidth, containerHeight);
            
            // 计算单元格大小，确保至少有一定大小
            this.CELL_SIZE = minDimension / this.GRID_SIZE;
            
            // 移动设备上最小单元格大小
            const minCellSize = this.isMobile ? 20 : 25;
            if (this.CELL_SIZE < minCellSize) {
                this.CELL_SIZE = minCellSize;
            }
            
            console.log(`计算单元格大小: ${this.CELL_SIZE}px, 容器: ${containerWidth}x${containerHeight}`);
        } else {
            // 备用值
            this.CELL_SIZE = this.isMobile ? 25 : 30;
        }
        return this.CELL_SIZE;
    }
    
    // 生成迷宫
    generateMaze() {
        const level = levelSystem.getCurrentLevel();
        
        // 清空之前的方块
        for (let y = 0; y < this.GRID_SIZE; y++) {
            for (let x = 0; x < this.GRID_SIZE; x++) {
                if (this.state.maze[y][x].type !== 'empty' && 
                    this.state.maze[y][x].type !== 'launcher') {
                    this.state.maze[y][x].type = 'empty';
                    this.state.maze[y][x].element.className = 'cell';
                    this.state.maze[y][x].element.innerHTML = '';
                }
            }
        }
        
        // 清空特殊物品
        this.state.specialCells.bombs = [];
        this.state.specialCells.treasure = null;
        this.state.specialCells.flag = null;
        this.state.hasTreasure = false;
        this.state.hasFlag = false;
        this.state.chestCollected = false;
        
        // 放置3个炸弹
        for (let i = 0; i < 3; i++) {
            this.placeSpecialItem('bomb');
        }
        
        // 放置1个宝箱
        this.placeSpecialItem('treasure');
        
        // 放置1个终点旗帜
        this.placeSpecialItem('flag');
        
        // 放置彩色方块
        const totalWalls = level.walls || 90;
        const whiteWalls = level.whiteWalls || 0;
        let placed = 0;
        
        while (placed < totalWalls) {
            const rx = Math.floor(Math.random() * this.GRID_SIZE);
            const ry = Math.floor(Math.random() * (this.GRID_SIZE - 3)) + 1;
            
            if (this.state.maze[ry][rx].type === 'empty') {
                // 决定方块颜色
                let color;
                if (placed < whiteWalls) {
                    color = 'white';
                } else {
                    // 白色方块概率1/8，其他颜色随机
                    color = Math.random() < 0.125 ? 'white' : 
                           this.COLORS[Math.floor(Math.random() * 7)];
                }
                
                this.state.maze[ry][rx].type = 'color';
                this.state.maze[ry][rx].color = color;
                this.state.maze[ry][rx].element.className = `cell color ${color}`;
                placed++;
            }
        }
        
        // 确保从发射台到终点的路径
        this.ensurePathToFlag();
    }
    
    // 放置特殊物品
    placeSpecialItem(type) {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const x = Math.floor(Math.random() * this.GRID_SIZE);
            const y = Math.floor(Math.random() * (this.GRID_SIZE - 3)) + 1;
            
            if (this.state.maze[y][x].type === 'empty') {
                this.state.maze[y][x].type = type;
                
                // 调整图标大小
                const iconSize = this.isMobile ? '3vw' : '1.5vw';
                
                switch(type) {
                    case 'bomb':
                        this.state.maze[y][x].element.className = 'cell bomb';
                        this.state.maze[y][x].element.innerHTML = '💣';
                        this.state.maze[y][x].element.style.fontSize = iconSize;
                        this.state.specialCells.bombs.push({x, y});
                        break;
                        
                    case 'treasure':
                        this.state.maze[y][x].element.className = 'cell treasure';
                        this.state.maze[y][x].element.innerHTML = '🗃️';
                        this.state.maze[y][x].element.style.fontSize = iconSize;
                        this.state.specialCells.treasure = {x, y};
                        break;
                        
                    case 'flag':
                        this.state.maze[y][x].element.className = 'cell flag';
                        this.state.maze[y][x].element.innerHTML = '🏁';
                        this.state.maze[y][x].element.style.fontSize = iconSize;
                        this.state.specialCells.flag = {x, y};
                        break;
                }
                
                placed = true;
            }
            
            attempts++;
        }
    }
    
    // 确保从发射台到终点的路径
    ensurePathToFlag() {
        // 简单实现：在发射台上方留出空间
        const launcherX = Math.floor(this.GRID_SIZE / 2);
        for (let y = this.GRID_SIZE - 2; y >= this.GRID_SIZE - 4; y--) {
            if (this.state.maze[y][launcherX].type !== 'empty' && 
                this.state.maze[y][launcherX].type !== 'flag') {
                this.state.maze[y][launcherX].type = 'empty';
                this.state.maze[y][launcherX].element.className = 'cell';
                this.state.maze[y][launcherX].element.innerHTML = '';
            }
        }
    }
    
    // 更新发射台颜色
    updateLauncherColor() {
        const launcherX = Math.floor(this.GRID_SIZE / 2);
        const launcherY = this.GRID_SIZE - 1;
        const launcherCell = this.state.maze[launcherY][launcherX].element;
        
        // 移除之前的颜色指示器
        const oldIndicator = launcherCell.querySelector('.next-color-indicator');
        if (oldIndicator) oldIndicator.remove();
        
        // 添加新的颜色指示器
        const indicator = document.createElement('div');
        indicator.className = 'next-color-indicator';
        indicator.style.background = this.getColorHex(this.state.nextColor);
        indicator.style.boxShadow = `0 0 10px ${this.getColorHex(this.state.nextColor)}, 0 0 20px ${this.getColorHex(this.state.nextColor)}`;
        indicator.style.width = (this.CELL_SIZE / 3) + 'px';
        indicator.style.height = (this.CELL_SIZE / 3) + 'px';
        launcherCell.appendChild(indicator);
    }
    
    // 开始自动发射
    startAutoShoot(tx, ty) {
        if (this.state.shootInterval) clearInterval(this.state.shootInterval);
        
        this.state.shootInterval = setInterval(() => {
            if (this.state.isMouseDown && this.state.active) {
                this.shootAt(tx, ty);
            } else {
                this.stopAutoShoot();
            }
        }, this.state.shootDelay);
    }
    
    // 停止自动发射
    stopAutoShoot() {
        if (this.state.shootInterval) {
            clearInterval(this.state.shootInterval);
            this.state.shootInterval = null;
        }
    }
    
    // 发射弹药
    shootAt(tx, ty) {
        if (!this.state.active) return;
        
        const launcherX = Math.floor(this.GRID_SIZE / 2);
        const launcherY = this.GRID_SIZE - 1;
        
        if (tx === launcherX && ty === launcherY) return;
        
        // 检查弹药
        if (!this.state.infiniteAmmo && this.state.ammo <= 0) {
            return;
        }
        
        // 消耗弹药
        if (!this.state.infiniteAmmo) {
            this.state.ammo--;
            this.updateUI();
        }
        
        // 使用当前颜色发射
        const color = this.state.nextColor;
        
        // 选择下一个颜色（考虑白色子弹概率）
        let nextColor;
        if (Math.random() < this.state.whiteChance) {
            nextColor = 'white';
        } else {
            nextColor = this.COLORS[Math.floor(Math.random() * 7)];
        }
        this.state.nextColor = nextColor;
        this.updateLauncherColor();
        
        // 创建弹药
        this.createProjectile(
            launcherX * this.CELL_SIZE + this.CELL_SIZE/2,
            launcherY * this.CELL_SIZE + this.CELL_SIZE/2,
            tx * this.CELL_SIZE + this.CELL_SIZE/2,
            ty * this.CELL_SIZE + this.CELL_SIZE/2,
            color
        );
    }
    
    createProjectile(sx, sy, tx, ty, color) {
        const proj = document.createElement('div');
        proj.className = 'projectile';
        proj.style.background = this.getColorHex(color);
        proj.style.color = this.getColorHex(color);
        proj.style.left = sx + 'px';
        proj.style.top = sy + 'px';
        
        // 根据设备调整弹药大小
        const projectileSize = this.isMobile ? this.CELL_SIZE / 8 : this.CELL_SIZE / 6;
        proj.style.width = projectileSize + 'px';
        proj.style.height = projectileSize + 'px';
        
        this.elements.gridContainer.appendChild(proj);
        
        // 计算方向
        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const speed = this.PROJECTILE_SPEED;
        
        this.state.projectiles.push({
            element: proj,
            x: sx, 
            y: sy,
            vx: dx/dist * speed,
            vy: dy/dist * speed,
            color: color,
            life: 180,
            maxLife: 180,
            createdAt: Date.now(),
            fading: false,
            positionHistory: [],
            lastPositions: []
        });
    }
    
    // 游戏主循环（移动设备帧率优化）
    gameLoop() {
        // 设置循环运行标志
        this.isGameLoopRunning = true;
        
        // 如果游戏不活跃，停止循环
        if (!this.state.active) {
            this.stopGameLoop();
            return;
        }
        
        const now = Date.now();
        
        // 帧率控制
        const elapsed = now - (this.lastFrameTime || 0);
        if (elapsed < (1000 / this.targetFPS)) {
            this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
            return;
        }
        
        this.lastFrameTime = now;
        
        // 重新计算单元格大小（如果窗口大小改变）
        this.calculateCellSize();
        
        // 更新弹药
        for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
            const p = this.state.projectiles[i];
            
            // 记录位置历史
            p.lastPositions.push({x: p.x, y: p.y, time: now});
            p.lastPositions = p.lastPositions.filter(pos => now - pos.time < 500);
            
            // 检查异常情况
            let shouldRemove = false;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            
            // 1. 速度接近0
            if (speed < 0.1 && p.life < 100) {
                shouldRemove = true;
            }
            
            // 2. 速度异常大
            if (speed > 100) {
                shouldRemove = true;
            }
            
            // 3. 长时间卡住
            if (p.lastPositions.length >= 3) {
                const firstPos = p.lastPositions[0];
                const lastPos = p.lastPositions[p.lastPositions.length-1];
                const distance = Math.sqrt(
                    Math.pow(lastPos.x - firstPos.x, 2) + 
                    Math.pow(lastPos.y - firstPos.y, 2)
                );
                
                if (distance < 1 && p.life < 80) {
                    shouldRemove = true;
                }
            }
            
            // 4. 存活时间过长
            if (now - p.createdAt > 3000) {
                shouldRemove = true;
            }
            
            // 5. 超出边界
            const maxBoundary = this.GRID_SIZE * this.CELL_SIZE + 100;
            if (p.x < -100 || p.x > maxBoundary || p.y < -100 || p.y > maxBoundary) {
                shouldRemove = true;
            }
            
            // 清理异常弹药
            if (shouldRemove) {
                if (p.element && p.element.parentNode) {
                    p.element.remove();
                }
                this.state.projectiles.splice(i, 1);
                continue;
            }
            
            // 正常移动
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            // 更新弹药位置
            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';
            
            // 淡出效果
            if (p.life < 30 && !p.fading) {
                p.element.style.opacity = '0.5';
                p.fading = true;
            }
            
            // 检查是否击中特殊物品
            this.checkSpecialItemHit(p, i);
            
            // 检查是否击中彩色方块
            const gx = Math.floor(p.x / this.CELL_SIZE);
            const gy = Math.floor(p.y / this.CELL_SIZE);
            
            if (gx >= 0 && gx < this.GRID_SIZE && gy >= 0 && gy < this.GRID_SIZE) {
                const cell = this.state.maze[gy][gx];
                
                if (cell.type === 'color') {
                    // 检查颜色是否匹配
                    const isMatch = cell.color === p.color || 
                                   (p.color === 'white' && this.state.whitePowerful);
                    
                    if (isMatch) {
                        // 颜色匹配，爆炸
                        this.explode(gx, gy, p.color);
                        if (p.element && p.element.parentNode) {
                            p.element.remove();
                        }
                        this.state.projectiles.splice(i, 1);
                        continue;
                    } else {
                        // 颜色不匹配，反弹
                        const result = this.bounceProjectile(p, gx, gy, cell.color);
                        if (!result) {
                            if (p.element && p.element.parentNode) {
                                p.element.remove();
                            }
                            this.state.projectiles.splice(i, 1);
                        }
                        continue;
                    }
                }
            }
            
            // 生命周期结束
            if (p.life <= 0) {
                if (p.element && p.element.parentNode) {
                    p.element.remove();
                }
                this.state.projectiles.splice(i, 1);
            }
        }
        
        // 检查弹药耗尽且未到达终点的情况
        if (this.state.active && 
            !this.state.infiniteAmmo && 
            this.state.ammo <= 0 && 
            !this.state.hasFlag && 
            this.state.projectiles.length === 0) {
    
            // 弹药耗尽，游戏失败
            this.gameOver('ammo');
        }
        
        // 更新爆炸效果（移动设备上减少效果以提升性能）
        for (let i = this.state.explosions.length - 1; i >= 0; i--) {
            const e = this.state.explosions[i];
            e.size += this.isMobile ? 2 : 3;
            e.life -= this.isMobile ? 0.1 : 0.08;
            
            e.element.style.width = e.size + 'px';
            e.element.style.height = e.size + 'px';
            e.element.style.left = (e.x - e.size/2) + 'px';
            e.element.style.top = (e.y - e.size/2) + 'px';
            e.element.style.opacity = e.life;
            
            if (e.life <= 0) {
                if (e.element && e.element.parentNode) {
                    e.element.remove();
                }
                this.state.explosions.splice(i, 1);
            }
        }
        
        // 继续游戏循环
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // 检查特殊物品击中
    checkSpecialItemHit(projectile, index) {
        // 检查炸弹
        for (const bomb of this.state.specialCells.bombs) {
            const tx = bomb.x * this.CELL_SIZE + this.CELL_SIZE/2;
            const ty = bomb.y * this.CELL_SIZE + this.CELL_SIZE/2;
            const dx = projectile.x - tx;
            const dy = projectile.y - ty;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < this.CELL_SIZE/2) {
                this.hitBomb(bomb.x, bomb.y);
                if (projectile.element && projectile.element.parentNode) {
                    projectile.element.remove();
                }
                this.state.projectiles.splice(index, 1);
                return;
            }
        }
        
        // 检查宝箱
        if (this.state.specialCells.treasure && !this.state.chestCollected) {
            const tx = this.state.specialCells.treasure.x * this.CELL_SIZE + this.CELL_SIZE/2;
            const ty = this.state.specialCells.treasure.y * this.CELL_SIZE + this.CELL_SIZE/2;
            const dx = projectile.x - tx;
            const dy = projectile.y - ty;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < this.CELL_SIZE/2) {
                this.hitTreasure(this.state.specialCells.treasure.x, this.state.specialCells.treasure.y);
                if (projectile.element && projectile.element.parentNode) {
                    projectile.element.remove();
                }
                this.state.projectiles.splice(index, 1);
                return;
            }
        }
        
        // 检查终点旗帜
        if (this.state.specialCells.flag && !this.state.hasFlag) {
            const tx = this.state.specialCells.flag.x * this.CELL_SIZE + this.CELL_SIZE/2;
            const ty = this.state.specialCells.flag.y * this.CELL_SIZE + this.CELL_SIZE/2;
            const dx = projectile.x - tx;
            const dy = projectile.y - ty;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < this.CELL_SIZE/2) {
                this.hitFlag(this.state.specialCells.flag.x, this.state.specialCells.flag.y);
                if (projectile.element && projectile.element.parentNode) {
                    projectile.element.remove();
                }
                this.state.projectiles.splice(index, 1);
                return;
            }
        }
    }
    
    // 击中炸弹
    hitBomb(x, y) {
        // 播放爆炸音效
        audioManager.playExplosion2();
        
        // 创建击中效果
        this.createHitEffect(x * this.CELL_SIZE + this.CELL_SIZE/2, 
                           y * this.CELL_SIZE + this.CELL_SIZE/2, '#ff3333');
        
        // 创建爆炸特效
        const exp = document.createElement('div');
        exp.className = 'explosion';
        exp.style.background = '#ff3333';
        exp.style.left = (x * this.CELL_SIZE + this.CELL_SIZE/2) + 'px';
        exp.style.top = (y * this.CELL_SIZE + this.CELL_SIZE/2) + 'px';
        exp.style.width = '20px';
        exp.style.height = '20px';
        this.elements.gridContainer.appendChild(exp);
        
        this.state.explosions.push({
            element: exp,
            x: x * this.CELL_SIZE + this.CELL_SIZE/2,
            y: y * this.CELL_SIZE + this.CELL_SIZE/2,
            size: 10,
            life: 1
        });
        
        // 移除炸弹
        this.removeBomb(x, y);
        
        // 检查炸弹免疫
        if (this.state.infiniteLife || this.state.bombImmunityUsed < this.state.bombImmunity) {
            this.state.bombImmunityUsed++;
            return; // 免疫本次伤害
        }
        
        // 减少生命
        this.state.lives--;
        this.updateUI();
        
        // 屏幕震动（移动设备上减少震动强度）
        this.elements.gridContainer.classList.add('screen-shake');
        setTimeout(() => {
            this.elements.gridContainer.classList.remove('screen-shake');
        }, this.isMobile ? 80 : 100);
        
        // 检查游戏是否失败
        if (this.state.lives <= 0) {
            this.gameOver('bomb');
        }
    }
    
    // 移除炸弹
    removeBomb(x, y) {
        // 更新迷宫状态
        this.state.maze[y][x].type = 'empty';
        this.state.maze[y][x].element.className = 'cell';
        this.state.maze[y][x].element.innerHTML = '';
        this.state.maze[y][x].element.style.fontSize = '';
        
        // 从炸弹数组中移除
        this.state.specialCells.bombs = this.state.specialCells.bombs.filter(
            bomb => !(bomb.x === x && bomb.y === y)
        );
        
        // 创建炸弹消失特效
        this.createHitEffect(x * this.CELL_SIZE + this.CELL_SIZE/2, 
                           y * this.CELL_SIZE + this.CELL_SIZE/2, '#ff3333');
    }
    
    // 击中宝箱
    hitTreasure(x, y) {
        // 宝箱已被收集，避免重复
        if (this.state.chestCollected) return;
        
        this.state.hasTreasure = true;
        this.state.chestCollected = true;
        
        // 直接加钱
        const treasureValue = 200;
        this.state.money += treasureValue;
        this.updateUI();
        
        // 移除宝箱
        this.removeTreasure(x, y);
        
        // 创建特效
        this.createHitEffect(x * this.CELL_SIZE + this.CELL_SIZE/2, 
                           y * this.CELL_SIZE + this.CELL_SIZE/2, '#ffcc00');
        
        // 播放音效
        audioManager.playScore();
        
        // 显示金币增加特效
        this.showMoneyGain(treasureValue);
    }
    
    // 添加一个显示金币增加特效的方法
    showMoneyGain(amount) {
        const moneyElement = document.getElementById('money');
        if (!moneyElement) return;
        
        const gainElement = document.createElement('div');
        gainElement.className = 'score-gain';
        gainElement.textContent = `+${amount}`;
        gainElement.style.color = '#ffcc00';
        gainElement.style.left = (moneyElement.offsetLeft + Math.random() * 50) + 'px';
        gainElement.style.top = (moneyElement.offsetTop - 20) + 'px';
        
        const statsContainer = document.querySelector('.player-stats');
        if (statsContainer) {
            statsContainer.appendChild(gainElement);
        }
        
        setTimeout(() => {
            if (gainElement.parentNode) {
                gainElement.remove();
            }
        }, 800);
    }
    
    // 添加移除宝箱的方法
    removeTreasure(x, y) {
        // 更新迷宫状态
        this.state.maze[y][x].type = 'empty';
        this.state.maze[y][x].element.className = 'cell';
        this.state.maze[y][x].element.innerHTML = '';
        this.state.maze[y][x].element.style.fontSize = '';
        
        // 从特殊物品中移除
        this.state.specialCells.treasure = null;
    }
    
    // 击中终点旗帜
    hitFlag(x, y) {
        this.state.hasFlag = true;
        
        // 创建特效
        this.createHitEffect(x * this.CELL_SIZE + this.CELL_SIZE/2, 
                           y * this.CELL_SIZE + this.CELL_SIZE/2, '#33ff33');
        
        // 播放胜利音效
        audioManager.playVictory();
        
        // 延迟显示结算界面
        setTimeout(() => {
            this.completeLevel();
        }, 500);
    }
    
    // 反弹弹药
    bounceProjectile(p, gx, gy, blockColor) {
        // 减少光弹生命值
        p.life -= 20;
        
        // 播放反弹音效
        audioManager.playBounce();
        
        // 创建反弹特效
        this.createBounceEffect(gx, gy, p.color, blockColor);
        
        // 简单反弹：根据击中方块的哪一边来反弹
        const cellX = gx * this.CELL_SIZE + this.CELL_SIZE/2;
        const cellY = gy * this.CELL_SIZE + this.CELL_SIZE/2;
        
        const relX = p.x - cellX;
        const relY = p.y - cellY;
        
        if (Math.abs(relX) > Math.abs(relY)) {
            // 击中左右边
            p.vx = -p.vx;
        } else {
            // 击中上下边
            p.vy = -p.vy;
        }
        
        // 添加随机扰动（减小扰动幅度）
        const randomFactor = this.isMobile ? 1.5 : 2;
        p.vx += (Math.random() - 0.5) * randomFactor;
        p.vy += (Math.random() - 0.5) * randomFactor;
        
        // 重新归一化速度
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        p.vx = (p.vx / speed) * this.PROJECTILE_SPEED;
        p.vy = (p.vy / speed) * this.PROJECTILE_SPEED;
        
        return p.life > 0;
    }
    
    // 创建反弹特效
    createBounceEffect(gx, gy, projectileColor, blockColor) {
        const effect = document.createElement('div');
        effect.className = 'bounce-effect';
        
        const gradient = `radial-gradient(circle, ${this.getColorHex(projectileColor)} 0%, ${this.getColorHex(blockColor)} 50%, transparent 100%)`;
        effect.style.background = gradient;
        effect.style.left = (gx * this.CELL_SIZE + this.CELL_SIZE/2 - 10) + 'px';
        effect.style.top = (gy * this.CELL_SIZE + this.CELL_SIZE/2 - 10) + 'px';
        
        this.elements.gridContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 400);
    }
    
    // 爆炸效果
    explode(x, y, color) {
        // 播放爆炸音效
        audioManager.playExplosion();
        
        // 创建爆炸特效
        const exp = document.createElement('div');
        exp.className = 'explosion';
        exp.style.background = this.getColorHex(color);
        exp.style.left = (x * this.CELL_SIZE + this.CELL_SIZE/2) + 'px';
        exp.style.top = (y * this.CELL_SIZE + this.CELL_SIZE/2) + 'px';
        exp.style.width = '20px';
        exp.style.height = '20px';
        this.elements.gridContainer.appendChild(exp);
        
        this.state.explosions.push({
            element: exp,
            x: x * this.CELL_SIZE + this.CELL_SIZE/2,
            y: y * this.CELL_SIZE + this.CELL_SIZE/2,
            size: 10,
            life: 1
        });
        
        // 移除彩色方块
        this.state.maze[y][x].type = 'empty';
        this.state.maze[y][x].element.className = 'cell';
        
        // 增加分数
        const baseScore = 7;
        const comboBonus = Math.min(this.state.combo, 1) * 0;
        const totalScore = Math.floor((baseScore + comboBonus) * this.state.scoreMultiplier);
        this.addScore(totalScore);
        
        // 增加连击
        this.state.combo++;
        
        // 链式反应
        const directions = [
            [0, -1], [1, -1], [1, 0], [1, 1],
            [0, 1], [-1, 1], [-1, 0], [-1, -1]
        ];
        
        // 随机选择方向
        const selected = [];
        while (selected.length < Math.min(this.state.splitDirections, 8)) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            if (!selected.some(d => d[0]===dir[0] && d[1]===dir[1])) {
                selected.push(dir);
            }
        }
        
        // 发射弹药
        selected.forEach(dir => {
            for (let j = 0; j < this.state.splitCount; j++) {
                // 爆炸产生的弹药有白色概率
                const randomColor = Math.random() < this.state.whiteChance ? 'white' : 
                                   this.COLORS[Math.floor(Math.random() * 7)];
                
                // 创建分裂弹药
                this.createExplosionProjectile(
                    x * this.CELL_SIZE + this.CELL_SIZE/2,
                    y * this.CELL_SIZE + this.CELL_SIZE/2,
                    x * this.CELL_SIZE + this.CELL_SIZE/2 + dir[0] * 100,
                    y * this.CELL_SIZE + this.CELL_SIZE/2 + dir[1] * 100,
                    randomColor
                );
            }
        });
    }
    
    createExplosionProjectile(sx, sy, tx, ty, color) {
        const proj = document.createElement('div');
        proj.className = 'projectile';
        proj.style.background = this.getColorHex(color);
        proj.style.color = this.getColorHex(color);
        proj.style.left = sx + 'px';
        proj.style.top = sy + 'px';
        
        const projectileSize = this.isMobile ? this.CELL_SIZE / 8 : this.CELL_SIZE / 6;
        proj.style.width = projectileSize + 'px';
        proj.style.height = projectileSize + 'px';
        
        this.elements.gridContainer.appendChild(proj);
        
        // 计算方向
        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const speed = this.EXPLOSION_PROJECTILE_SPEED;
        
        this.state.projectiles.push({
            element: proj,
            x: sx, 
            y: sy,
            vx: dx/dist * speed,
            vy: dy/dist * speed,
            color: color,
            life: 180,
            maxLife: 180,
            createdAt: Date.now(),
            fading: false,
            positionHistory: [],
            lastPositions: []
        });
    }
    
    // 创建击中效果
    createHitEffect(x, y, color) {
        const effect = document.createElement('div');
        effect.className = 'hit-effect';
        effect.style.background = `radial-gradient(circle, ${color}00 0%, ${color}80 50%, ${color}00 100%)`;
        effect.style.left = (x - 20) + 'px';
        effect.style.top = (y - 20) + 'px';
        this.elements.gridContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 500);
    }
    
    // 添加分数
    addScore(points) {
        const oldScore = this.state.score;
        this.state.score += points;
        
        // 创建分数增加特效
        const gainElement = document.createElement('div');
        gainElement.className = 'score-gain';
        gainElement.textContent = `+${points}`;
        gainElement.style.left = Math.random() * 100 + 'px';
        
        const scoreDisplay = document.querySelector('.score-display');
        if (scoreDisplay) {
            scoreDisplay.appendChild(gainElement);
        }
        
        // 移除特效
        setTimeout(() => {
            if (gainElement.parentNode) {
                gainElement.remove();
            }
        }, 800);
        
        // 播放分数音效
        audioManager.playScore();
        
        // 更新分数显示
        this.updateScoreDisplay(oldScore, this.state.score);
    }
    
    // 更新分数显示（带动画）
    updateScoreDisplay(oldScore, newScore) {
        const scoreElement = this.elements.score;
        if (!scoreElement) return;
        
        // 数字逐个变化动画
        let current = oldScore;
        const increment = Math.ceil((newScore - oldScore) / 10);
        
        const update = () => {
            current += increment;
            if (current >= newScore) {
                current = newScore;
                scoreElement.textContent = current;
                return;
            }
            
            scoreElement.textContent = current;
            setTimeout(update, 50);
        };
        
        update();
    }
    
    // 更新UI
    updateUI() {
        if (this.elements.score) this.elements.score.textContent = this.state.score;
        if (this.elements.lives) this.elements.lives.textContent = this.state.lives;
        if (this.elements.ammo) this.elements.ammo.textContent = this.state.ammo;
        if (this.elements.money) this.elements.money.textContent = this.state.money;
    }
    
    // 清理所有弹药和特效
    cleanupGameElements() {
        console.log('清理游戏元素...');
        
        // 清理所有弹药
        for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.state.projectiles[i];
            if (projectile.element && projectile.element.parentNode) {
                projectile.element.remove();
            }
        }
        this.state.projectiles = [];
        
        // 清理所有爆炸效果
        for (let i = this.state.explosions.length - 1; i >= 0; i--) {
            const explosion = this.state.explosions[i];
            if (explosion.element && explosion.element.parentNode) {
                explosion.element.remove();
            }
        }
        this.state.explosions = [];
        
        // 清理其他特效元素
        const container = this.elements.gridContainer;
        if (container) {
            // 清理弹跳效果
            const bounceEffects = container.querySelectorAll('.bounce-effect');
            bounceEffects.forEach(effect => {
                if (effect.parentNode) effect.remove();
            });
            
            // 清理击中效果
            const hitEffects = container.querySelectorAll('.hit-effect');
            hitEffects.forEach(effect => {
                if (effect.parentNode) effect.remove();
            });
        }
        
        // 清理分数增益效果
        const scoreGains = document.querySelectorAll('.score-gain');
        scoreGains.forEach(gain => {
            if (gain.parentNode) gain.remove();
        });
        
        // 停止所有射击间隔
        this.stopAutoShoot();
        
        console.log('游戏元素清理完成');
    }
    
    // 完成关卡
    completeLevel() {
        console.log('完成关卡，开始清理...');
        
        // 停止游戏状态
        this.state.active = false;
        this.stopAutoShoot();
        this.stopGameLoop(); // 停止游戏循环
        
        // 清理所有弹药和特效
        this.cleanupGameElements();
        
        // 等待一帧确保清理完成
        requestAnimationFrame(() => {
            // 计算本关收入
            const levelScore = this.state.score;
            const chestBonus = this.state.hasTreasure ? 200 : 0;
            const baseMoney = Math.floor(levelScore * 0.7);
            const totalMoney = Math.floor((baseMoney + chestBonus) * this.state.moneyMultiplier);
            
            // 增加金币
            this.state.money += totalMoney;
            
            // 检查是否满足积分要求
            const levelReq = levelSystem.getCurrentLevel().scoreReq;
            const requirementMet = levelReq === 0 || this.state.score >= levelReq;
            
            // 延迟显示结算界面，确保清理完成
            setTimeout(() => {
                console.log('显示结算界面，分数:', levelScore, '要求分数:', levelReq);
                // 显示结算界面
                if (typeof window.showResultScreen === 'function') {
                    window.showResultScreen(levelScore, chestBonus, totalMoney, levelReq, requirementMet);
                }
            }, 100);
        });
    }
    
    // 游戏结束
    gameOver(reason) {
        console.log('游戏结束，原因:', reason, '开始清理...');
        
        // 停止游戏状态
        this.state.active = false;
        this.stopAutoShoot();
        this.stopGameLoop(); // 停止游戏循环
        
        // 清理所有弹药和特效
        this.cleanupGameElements();
        
        // 等待一帧确保清理完成
        requestAnimationFrame(() => {
            // 根据失败原因播放不同音效
            if (reason === 'bomb') {
                audioManager.playFail();
            } else if (reason === 'ammo') {
                audioManager.playFail();
            } else {
                audioManager.playFail();
            }
            
            // 延迟显示失败界面，确保清理完成
            setTimeout(() => {
                console.log('显示失败界面');
                // 显示失败界面
                if (typeof window.showFailScreen === 'function') {
                    window.showFailScreen(reason, this.state.level, this.state.money, this.state.combo);
                }
            }, 100);
        });
    }
    
    // 颜色转十六进制
    getColorHex(color) {
        const map = {
            red: '#ff3333', 
            orange: '#ff9933', 
            yellow: '#ffff33',
            green: '#33ff33', 
            cyan: '#33ffff', 
            blue: '#3333ff', 
            purple: '#cc33ff',
            white: '#ffffff'
        };
        return map[color] || '#fff';
    }
    
    // 暂停游戏
    pauseGame() {
        this.state.active = false;
        this.stopAutoShoot();
        this.stopGameLoop(); // 停止游戏循环
    }
    
    // 继续游戏
    resumeGame() {
        this.state.active = true;
        // 确保游戏循环没有在运行
        if (!this.isGameLoopRunning) {
            this.gameLoop();
        }
    }
    
    restartLevel() {
        // 停止游戏循环
        this.stopGameLoop();
        
        // 重置游戏状态，保留金钱
        this.resetGameState(false);
        
        // 继续游戏
        this.state.active = true;
        
        // 确保游戏循环只启动一次
        if (!this.isGameLoopRunning) {
            this.gameLoop();
        }
    }
}

// 创建全局游戏核心实例
const gameCore = new GameCore();