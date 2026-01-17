// 关卡系统
class LevelSystem {
    constructor() {
        // 关卡设计数据（基于提供的表格）
        this.levelData = [
            // 关卡1-5: 10x10棋盘，60个方块
            { id: 1, gridSize: 10, walls: 60, scoreReq: 0, description: "基础训练", price: 100, rarity: 1, unlockAt: 3 },
            { id: 2, gridSize: 10, walls: 60, scoreReq: 20, description: "初步挑战", price: 100, rarity: 1, unlockAt: 3 },
            { id: 3, gridSize: 10, walls: 60, scoreReq: 120, description: "进阶挑战", price: 150, rarity: 1, unlockAt: 3 },
            { id: 4, gridSize: 10, walls: 60, scoreReq: 150, description: "高手之路", price: 150, rarity: 1, unlockAt: 3 },
            { id: 5, gridSize: 10, walls: 60, scoreReq: 200, description: "大师挑战", price: 200, rarity: 2, unlockAt: 6 },
            
            // 关卡6-8: 15x15棋盘，135个方块
            { id: 6, gridSize: 15, walls: 135, scoreReq: 200, description: "扩展棋盘", price: 100, rarity: 1, unlockAt: 3 },
            { id: 7, gridSize: 15, walls: 135, scoreReq: 250, description: "难度提升", price: 200, rarity: 1, unlockAt: 3 },
            { id: 8, gridSize: 15, walls: 135, scoreReq: 300, description: "极限挑战", price: 200, rarity: 1, unlockAt: 3 },
            
            // 关卡9-15: 15x15棋盘，带白色方块
            { id: 9, gridSize: 15, walls: 135, whiteWalls: 80, scoreReq: 300, description: "白色恐怖", price: 300, rarity: 2, unlockAt: 6 },
            { id: 10, gridSize: 15, walls: 135, whiteWalls: 60, scoreReq: 350, description: "精确打击", price: 200, rarity: 2, unlockAt: 6 },
            { id: 11, gridSize: 15, walls: 135, whiteWalls: 60, scoreReq: 400, description: "终极考验", price: 200, rarity: 2, unlockAt: 6 },
            { id: 12, gridSize: 15, walls: 155, whiteWalls: 60, scoreReq: 450, description: "地狱难度", price: 200, rarity: 3, unlockAt: 9 },
            { id: 13, gridSize: 15, walls: 155, whiteWalls: 60, scoreReq: 450, description: "无尽前奏", price: 200, rarity: 3, unlockAt: 9 },
            { id: 14, gridSize: 15, walls: 155, whiteWalls: 60, scoreReq: 500, description: "传奇开始", price: 300, rarity: 3, unlockAt: 9 },
            { id: 15, gridSize: 15, walls: 155, whiteWalls: 60, scoreReq: 600, description: "最终考验", price: 150, rarity: 2, unlockAt: 6 }
        ];
        
        // 无限模式起始值
        this.infiniteBaseScore = 630;
        this.infiniteScoreIncrement = 30;
        
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
            walls: 155,
            whiteWalls: 60,
            scoreReq: scoreReq,
            description: `无限模式 ${infiniteLevel}`,
            isInfinite: true
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
            isInfinite: this.isInfiniteMode
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
            baseReward = 200 + (this.infiniteLevelCount * 20);
            this.infiniteLevelCount++;
        }
        
        return baseReward;
    }
}

// 创建全局关卡系统实例
const levelSystem = new LevelSystem();