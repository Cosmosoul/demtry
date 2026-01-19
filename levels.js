// 关卡系统 - 严格按照关卡设计表格修改
class LevelSystem {
    constructor() {
        // 严格按表格设计
        this.levelData = [
            // 关卡1: 10x10, 60方块, 15白色, 方块颜色: 白/红/黄/蓝, 弹珠颜色: 红/黄/蓝, 3炸弹, 无积分要求
            { 
                id: 1, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 0, 
                bombs: 3,
                availableBlockColors: ['white', 'red', 'yellow', 'blue'],
                availableProjectileColors: ['red', 'yellow', 'blue'],
                description: "基础训练"
            },
            
            // 关卡2: 10x10, 60方块, 15白色, 方块颜色: 白/红/黄/蓝, 弹珠颜色: 红/黄/蓝, 3炸弹, 30分
            { 
                id: 2, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 30, 
                bombs: 3,
                availableBlockColors: ['white', 'red', 'yellow', 'blue'],
                availableProjectileColors: ['red', 'yellow', 'blue'],
                description: "初步挑战"
            },
            
            // 关卡3: 10x10, 60方块, 15白色, 方块颜色: 白/红/黄/蓝, 弹珠颜色: 红/黄/蓝, 3炸弹, 120分
            { 
                id: 3, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 120, 
                bombs: 3,
                availableBlockColors: ['white', 'red', 'yellow', 'blue'],
                availableProjectileColors: ['red', 'yellow', 'blue'],
                description: "进阶挑战"
            },
            
            // 关卡4: 10x10, 60方块, 15白色, 方块颜色: 白/红/黄/蓝, 弹珠颜色: 红/黄/蓝, 3炸弹, 150分
            { 
                id: 4, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 150, 
                bombs: 3,
                availableBlockColors: ['white', 'red', 'yellow', 'blue'],
                availableProjectileColors: ['red', 'yellow', 'blue'],
                description: "高手之路"
            },
            
            // 关卡5: 10x10, 60方块, 15白色, 方块颜色: 白/红/黄/蓝, 弹珠颜色: 红/黄/蓝, 3炸弹, 200分
            { 
                id: 5, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 200, 
                bombs: 3,
                availableBlockColors: ['white', 'red', 'yellow', 'blue'],
                availableProjectileColors: ['red', 'yellow', 'blue'],
                description: "大师挑战"
            },
            
            // 关卡6: 10x10, 60方块, 15白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 4炸弹, 200分
            { 
                id: 6, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 200, 
                bombs: 4,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "扩展棋盘"
            },
            
            // 关卡7: 10x10, 60方块, 15白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 4炸弹, 250分
            { 
                id: 7, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 250, 
                bombs: 4,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "难度提升"
            },
            
            // 关卡8: 10x10, 60方块, 15白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 4炸弹, 300分
            { 
                id: 8, 
                gridSize: 10, 
                walls: 60, 
                whiteWalls: 15, 
                scoreReq: 300, 
                bombs: 4,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "极限挑战"
            },
            
            // 关卡9: 15x15, 135方块, 80白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 4炸弹, 300分, 数字方块1/10, 数字1-3
            { 
                id: 9, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 80, 
                scoreReq: 300, 
                bombs: 4,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "白色恐怖",
                hasNumberBlocks: true,
                numberBlockRatio: 0.1,
                numberRange: { min: 1, max: 3 }
            },
            
            // 关卡10: 15x15, 135方块, 60白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 5炸弹, 350分, 数字方块1/10, 数字1-3
            { 
                id: 10, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 60, 
                scoreReq: 350, 
                bombs: 5,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "精确打击",
                hasNumberBlocks: true,
                numberBlockRatio: 0.1,
                numberRange: { min: 1, max: 3 }
            },
            
            // 关卡11: 15x15, 135方块, 60白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 5炸弹, 400分, 数字方块1/10, 数字1-3
            { 
                id: 11, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 60, 
                scoreReq: 400, 
                bombs: 5,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "终极考验",
                hasNumberBlocks: true,
                numberBlockRatio: 0.1,
                numberRange: { min: 1, max: 3 }
            },
            
            // 关卡12: 15x15, 135方块, 60白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 5炸弹, 300分, 数字方块1/8, 数字1-3
            { 
                id: 12, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 60, 
                scoreReq: 300, 
                bombs: 5,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "地狱难度",
                hasNumberBlocks: true,
                numberBlockRatio: 0.125,
                numberRange: { min: 1, max: 3 }
            },
            
            // 关卡13: 15x15, 135方块, 60白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 6炸弹, 350分, 数字方块1/8, 数字1-3
            { 
                id: 13, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 60, 
                scoreReq: 350, 
                bombs: 6,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "无尽前奏",
                hasNumberBlocks: true,
                numberBlockRatio: 0.125,
                numberRange: { min: 1, max: 3 }
            },
            
            // 关卡14: 15x15, 135方块, 60白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 6炸弹, 400分, 数字方块1/8, 数字1-3
            { 
                id: 14, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 60, 
                scoreReq: 400, 
                bombs: 6,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "传奇开始",
                hasNumberBlocks: true,
                numberBlockRatio: 0.125,
                numberRange: { min: 1, max: 3 }
            },
            
            // 关卡15: 15x15, 135方块, 60白色, 方块颜色: 白色+7种彩色, 弹珠颜色: 7种彩色, 6炸弹, 450分, 数字方块1/7, 数字1-5
            { 
                id: 15, 
                gridSize: 15, 
                walls: 135, 
                whiteWalls: 60, 
                scoreReq: 450, 
                bombs: 6,
                availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
                description: "最终考验",
                hasNumberBlocks: true,
                numberBlockRatio: 1/7,
                numberRange: { min: 1, max: 5 }
            }
        ];
        
        // 无限模式起始值（第16关开始）
        this.infiniteBaseScore = 500;
        this.infiniteScoreIncrement = 30;
        this.infiniteBombs = 10;
        this.infiniteNumberBlockRatio = 1/7;
        this.infiniteNumberRange = { min: 1, max: 5 };
        
        // 当前游戏进度
        this.currentLevel = 1;
        this.maxLevelReached = 0;
        this.isInfiniteMode = false;
        this.infiniteLevelCount = 0;
    }
    
    // 获取当前关卡配置
    getCurrentLevel() {
        if (this.isInfiniteMode) {
            return this.getInfiniteLevel();
        }
        
        if (this.currentLevel <= this.levelData.length) {
            return this.levelData[this.currentLevel - 1];
        }
        
        // 如果超过15关，进入无限模式
        this.isInfiniteMode = true;
        return this.getInfiniteLevel();
    }
    
    // 获取无限模式关卡
    getInfiniteLevel() {
        const infiniteLevel = this.currentLevel - 15;
        const scoreReq = this.infiniteBaseScore + (infiniteLevel * this.infiniteScoreIncrement);
        
        return {
            id: this.currentLevel,
            gridSize: 15,
            walls: 135,
            whiteWalls: 60,
            scoreReq: scoreReq,
            bombs: this.infiniteBombs,
            availableBlockColors: ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
            availableProjectileColors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
            description: `无限模式 ${infiniteLevel}`,
            isInfinite: true,
            hasNumberBlocks: true,
            numberBlockRatio: this.infiniteNumberBlockRatio,
            numberRange: this.infiniteNumberRange
        };
    }
    
    // 进入下一关
    nextLevel() {
        this.currentLevel++;
        
        // 更新最高关卡记录
        if (this.currentLevel > this.maxLevelReached) {
            this.maxLevelReached = this.currentLevel;
        }
        
        // 检查是否需要显示通关界面（第15关后）
        if (this.currentLevel === 16 && !this.isInfiniteMode) {
            return 'completion';
        }
        
        return 'continue';
    }
    
    // 重置关卡进度
    reset() {
        this.currentLevel = 1;
        this.isInfiniteMode = false;
        this.infiniteLevelCount = 0;
    }
    
    // 获取关卡显示信息
    getLevelDisplayInfo() {
        const level = this.getCurrentLevel();
        
        return {
            number: this.currentLevel,
            scoreReq: level.scoreReq,
            description: level.description,
            gridSize: level.gridSize,
            bombs: level.bombs || 3,
            isInfinite: this.isInfiniteMode || false,
            hasNumberBlocks: level.hasNumberBlocks || false,
            availableProjectileColors: level.availableProjectileColors || ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
            availableBlockColors: level.availableBlockColors || ['white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
        };
    }
    
    // 检查关卡是否已解锁（用于商店道具）
    isLevelUnlocked(levelId) {
        return levelId <= this.maxLevelReached + 1;
    }
    
    // 开始无限模式
    startInfiniteMode() {
        this.isInfiniteMode = true;
        this.currentLevel = 16;
    }
    
    // 获取关卡奖励（金币）
    getLevelReward() {
        const level = this.getCurrentLevel();
        
        // 基础奖励基于关卡ID
        let baseReward = Math.min(100 + (this.currentLevel * 10), 500);
        
        // 无限模式奖励更高
        if (this.isInfiniteMode) {
            baseReward = 100 + (this.infiniteLevelCount * 10);
            this.infiniteLevelCount++;
        }
        
        return baseReward;
    }
}

// 创建全局关卡系统实例
const levelSystem = new LevelSystem();