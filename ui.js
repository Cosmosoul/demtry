// UI界面管理系统
class UIManager {
    constructor() {
        // 当前活动界面
        this.currentScreen = 'startScreen';
        
        // 初始化
        this.init();
    }
    
    // 初始化UI
    init() {
        // 显示开始界面
        this.showScreen('startScreen');
        
        // 初始化事件监听
        this.initEventListeners();
        
        // 播放主菜单背景音乐
        audioManager.playBGM('menu');
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 开始界面按钮
        document.getElementById('startGameBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.startGame();
        });
        
        document.getElementById('howToPlayBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.showScreen('helpScreen');
        });
        
        document.getElementById('settingsBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.showScreen('settingsScreen');
        });
        
        document.getElementById('exitGameBtn').addEventListener('click', () => {
            audioManager.playClick();
            if (confirm('确定要退出游戏吗？')) {
                window.close();
            }
        });
        
        // 返回按钮
        document.getElementById('backFromHelpBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.showScreen('startScreen');
        });
        
        document.getElementById('backFromSettingsBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.saveSettings();
            this.showScreen('startScreen');
        });
        
        // 设置滑块
        document.getElementById('bgmVolume').addEventListener('input', (e) => {
            document.getElementById('bgmValue').textContent = e.target.value + '%';
        });
        
        document.getElementById('sfxVolume').addEventListener('input', (e) => {
            document.getElementById('sfxValue').textContent = e.target.value + '%';
        });
        
        // 暂停按钮
        document.getElementById('pauseBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.showPauseMenu();
        });
        
        // 暂停菜单按钮
        document.getElementById('resumeBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.hidePauseMenu();
            // 确保游戏处于活跃状态
            gameCore.state.active = true;
            // 检查游戏循环是否已经在运行
            if (!gameCore.isGameLoopRunning) {
                gameCore.gameLoop();
            }
        });
        
        document.getElementById('restartLevelBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.hidePauseMenu();
            gameCore.restartLevel();
        });
        
        document.getElementById('quitToMenuBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.hidePauseMenu();
            this.quitToMenu();
        });
        
        // 结算界面按钮
        document.getElementById('continueToShopBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.showShop();
        });
        
        // 商店界面按钮
        document.getElementById('rerollBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.rerollShop();
        });
        
        document.getElementById('skipShopBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.skipShop();
        });
        
        // 失败界面按钮
        document.getElementById('backToStartBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.quitToMenu();
        });
        
        // 通关界面按钮
        document.getElementById('backToMenuCompletionBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.quitToMenu();
        });
        
        document.getElementById('startInfiniteModeBtn').addEventListener('click', () => {
            audioManager.playClick();
            this.startInfiniteMode();
        });
        
        // 声音控制按钮
        document.getElementById('soundToggle').addEventListener('click', () => {
            audioManager.toggleMute();
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentScreen === 'gameScreen') {
                this.showPauseMenu();
            }
            
            if (e.key === 'r' || e.key === 'R') {
                if (this.currentScreen === 'gameScreen') {
                    gameCore.restartLevel();
                }
            }
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            if (gameCore && typeof gameCore.calculateCellSize === 'function') {
                gameCore.calculateCellSize();
            }
            if (gameCore && typeof gameCore.updateLauncherColor === 'function') {
                gameCore.updateLauncherColor();
            }
        });
    }
    
    // 显示指定界面
    showScreen(screenId) {
        // 隐藏所有界面
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
        
        // 显示目标界面
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // 更新背景音乐
            this.updateBackgroundMusic(screenId);
        }
    }
    
    // 更新背景音乐
    updateBackgroundMusic(screenId) {
        let bgmType;
        
        switch(screenId) {
            case 'startScreen':
                bgmType = 'menu';
                break;
            case 'gameScreen':
                bgmType = 'game';
                break;
            case 'shopScreen':
                bgmType = 'shop';
                break;
            case 'failScreen':
                bgmType = 'fail';
                break;
            default:
                bgmType = 'menu';
        }
        
        audioManager.playBGM(bgmType);
    }
    
    // 开始游戏
    startGame() {
        // 重置游戏系统
        levelSystem.reset();
        shopSystem.resetGame();
        gameCore.startNewGame();
        
        // 切换到游戏界面
        this.showScreen('gameScreen');
    }
    
    // 显示暂停菜单
    showPauseMenu() {
        gameCore.pauseGame();
        document.getElementById('pauseMenu').style.display = 'flex';
    }
    
    // 隐藏暂停菜单
    hidePauseMenu() {
        document.getElementById('pauseMenu').style.display = 'none';
    }
    
    // 退出到主菜单
    quitToMenu() {
        // 重置游戏
        levelSystem.reset();
        shopSystem.resetGame();
        gameCore.stopGameLoop(); // 确保停止游戏循环
        
        // 切换到开始界面
        this.showScreen('startScreen');
    }
    
    // 显示结算界面
    showResultScreen(score, chestBonus, totalMoney, requiredScore, requirementMet) {
        // 更新界面数据
        document.getElementById('resultScore').textContent = score;
        document.getElementById('chestBonus').textContent = `+${chestBonus}`;
        document.getElementById('totalMoney').textContent = totalMoney;
        document.getElementById('requiredScore').textContent = requiredScore;
        
        // 更新状态显示
        const statusElement = document.getElementById('requirementStatus');
        if (requirementMet) {
            statusElement.className = 'status success';
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> 目标已达成';
        } else {
            statusElement.className = 'status fail';
            statusElement.innerHTML = '<i class="fas fa-times-circle"></i> 目标未达成';
            
            // 延迟显示失败界面
            setTimeout(() => {
                this.showFailScreen('score', levelSystem.currentLevel, gameCore.state.money, gameCore.state.combo);
            }, 2000);
            return;
        }
        
        // 显示结算界面
        document.getElementById('resultScreen').style.display = 'flex';
    }
    
    // 显示商店
    showShop() {
        // 隐藏结算界面
        document.getElementById('resultScreen').style.display = 'none';
        
        // 生成商店物品
        shopSystem.generateShopItems();
        
        // 渲染商店界面
        shopSystem.renderShop(gameCore.state.money);
        
        // 显示商店界面
        document.getElementById('shopScreen').style.display = 'flex';
    }
    
    // 重抽商店物品
    rerollShop() {
        // 检查金币是否足够
        if (gameCore.state.money < shopSystem.rerollCost) {
            alert('金币不足！');
            return;
        }
        
        // 扣除金币
        gameCore.state.money -= shopSystem.rerollCost;
        gameCore.updateUI();
        
        // 重抽
        shopSystem.rerollShopItems();
        
        // 重新渲染商店
        shopSystem.renderShop(gameCore.state.money);
    }
    
    // 跳过商店
    skipShop() {
        // 隐藏商店界面
        document.getElementById('shopScreen').style.display = 'none';
        
        // 进入下一关
        this.nextLevel();
    }
    
    // 进入下一关 - 修复版本
    nextLevel() {
        console.log('进入下一关，当前关卡:', levelSystem.currentLevel);
        
        // 检查是否显示通关界面
        const result = levelSystem.nextLevel();
        
        if (result === 'completion') {
            console.log('显示通关界面');
            // 显示通关界面
            document.getElementById('completionScreen').style.display = 'flex';
            return;
        }
        
        console.log('下一关编号:', levelSystem.currentLevel);
        
        // 解锁新道具
        shopSystem.unlockNewItems(levelSystem.currentLevel);
        
        // 重置游戏状态，保留金钱
        gameCore.resetGameState(false);
        
        // 确保游戏处于活跃状态
        gameCore.state.active = true;
        
        // 启动游戏循环
        if (!gameCore.isGameLoopRunning) {
            console.log('启动游戏循环');
            gameCore.gameLoop();
        }
        
        // 显示游戏界面
        this.showScreen('gameScreen');
        
        // 更新UI显示
        gameCore.updateUI();
        
        // 播放游戏背景音乐
        audioManager.playBGM('game');
    }
    
    // 显示失败界面
    showFailScreen(reason, level, money, combo) {
        // 更新界面数据
        document.getElementById('failLevel').textContent = level;
        document.getElementById('failMoney').textContent = money;
        document.getElementById('failCombo').textContent = combo;
        
        // 更新失败原因
        const reasonText = {
            'bomb': '生命值耗尽',
            'ammo': '弹药耗尽',
            'score': '积分不足'
        }[reason] || '游戏失败';
        
        document.getElementById('failReason').textContent = reasonText;
        
        // 显示失败界面
        document.getElementById('failScreen').style.display = 'flex';
        
        // 播放失败背景音乐
        audioManager.playBGM('fail');
    }
    
    // 开始无限模式
    startInfiniteMode() {
        console.log('开始无限模式');
        
        // 隐藏通关界面
        document.getElementById('completionScreen').style.display = 'none';
        
        // 进入无限模式
        levelSystem.startInfiniteMode();
        
        // 开始下一关
        this.nextLevel();
    }
    
    // 保存设置
    saveSettings() {
        const bgmVolume = document.getElementById('bgmVolume').value;
        const sfxVolume = document.getElementById('sfxVolume').value;
        
        // 更新音频管理器
        audioManager.updateBGMVolume(bgmVolume);
        audioManager.updateSFXVolume(sfxVolume);
        
        // 保存到本地存储
        localStorage.setItem('gameSettings', JSON.stringify({
            bgmVolume,
            sfxVolume,
            vibration: document.getElementById('vibration').checked,
            particles: document.getElementById('particles').checked
        }));
    }
    
    // 加载设置
    loadSettings() {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            document.getElementById('bgmVolume').value = settings.bgmVolume || 50;
            document.getElementById('sfxVolume').value = settings.sfxVolume || 70;
            document.getElementById('vibration').checked = settings.vibration !== false;
            document.getElementById('particles').checked = settings.particles !== false;
            
            document.getElementById('bgmValue').textContent = (settings.bgmVolume || 50) + '%';
            document.getElementById('sfxValue').textContent = (settings.sfxVolume || 70) + '%';
            
            // 更新音频管理器
            audioManager.updateBGMVolume(settings.bgmVolume || 50);
            audioManager.updateSFXVolume(settings.sfxVolume || 70);
        }
    }
}

// 全局函数供其他模块调用
window.showResultScreen = function(score, chestBonus, totalMoney, requiredScore, requirementMet) {
    console.log('显示结算界面，分数:', score, '要求分数:', requiredScore);
    uiManager.showResultScreen(score, chestBonus, totalMoney, requiredScore, requirementMet);
};

window.showFailScreen = function(reason, level, money, combo) {
    console.log('显示失败界面，原因:', reason, '关卡:', level);
    uiManager.showFailScreen(reason, level, money, combo);
};

// 在 ui.js 中修改 onShopItemBuy 函数
window.onShopItemBuy = function(itemId) {
    console.log('购买道具:', itemId);
    
    // 购买道具
    const result = shopSystem.buyItem(itemId, gameCore.state.money);
    
    if (result.success) {
        // 扣除金币
        gameCore.state.money -= result.price;
        
        // 重要：重新应用所有已购买道具的效果
        gameCore.applyShopEffects();
        
        // 更新UI显示弹药数量
        gameCore.updateUI();
        
        // 隐藏商店界面
        document.getElementById('shopScreen').style.display = 'none';
        
        // 播放购买音效
        audioManager.playPurchase();
        
        // 进入下一关
        uiManager.nextLevel();
    } else {
        alert(result.message);
    }
};

// 创建全局UI管理器实例
const uiManager = new UIManager();

// 加载设置
uiManager.loadSettings();