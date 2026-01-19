// 商店系统
class ShopSystem {
    constructor() {
        // 商品数据（基于提供的表格）
        this.items = [
            // 弹药包
            { id: '001', name: '小型弹药包', description: '购买后本局每关弹药增加20枚', price: 100, rarity: 1, unlockAt: 1, type: 'ammo' },
            { id: '002', name: '中型弹药包', description: '购买后本局每关弹药增加50枚', price: 200, rarity: 1, unlockAt: 1, type: 'ammo' },
            { id: '003', name: '大型弹药包', description: '购买后本局每关弹药增加100枚', price: 500, rarity: 2, unlockAt: 3, type: 'ammo' },
            
            // 生命药水
            { id: '004', name: '小型生命药水', description: '购买后本局每关第一次触发炸弹不会受到伤害', price: 200, rarity: 2, unlockAt: 1, type: 'bombImmunity',maxOne: true },
            { id: '005', name: '中型生命药水', description: '购买后本局每关前两次触发炸弹不会受到伤害', price: 500, rarity: 2, unlockAt: 1, type: 'bombImmunity',maxOne: true },
            { id: '006', name: '大型生命药水', description: '购买后本局每关前三次触发炸弹不会受到伤害', price: 700, rarity: 3, unlockAt: 3, type: 'bombImmunity',maxOne: true },
            
            // 白色子弹相关
            { id: '007', name: '白色！', description: '购买后本局每次发射随机子弹为白色子弹概率重置为1/10', price: 1000, rarity: 4, unlockAt: 9, type: 'whiteChance', maxOne: true },
            { id: '008', name: '更多的白色！', description: '购买后本局每次发射随机子弹为白色子弹概率重置为1/8', price: 1000, rarity: 5, unlockAt: 9, type: 'whiteChance', maxOne: true },
            { id: '009', name: '更强的白色！', description: '购买后本局白色子弹可以使全部颜色触发爆炸分裂', price: 2000, rarity: 5, unlockAt: 12, type: 'whitePower', maxOne: true },
            
            // 分裂相关
            { id: '010', name: '分裂！', description: '购买后本局每次触发爆炸分裂时产生的粒子每个方向数量+1（上限为5）', price: 500, rarity: 1, unlockAt: 9, type: 'splitCount', maxLevel: 5 },
            { id: '011', name: '激进分裂！', description: '购买后本局每次触发爆炸分裂时产生的粒子随机飞向的方向数量+1（上限为8）', price: 500, rarity: 1, unlockAt: 15, type: 'splitDirections', maxLevel: 8 },
            
            // 特殊能力
            { id: '012', name: '无限火力！', description: '购买后本局无弹药限制', price: 1000, rarity: 5, unlockAt: 12, type: 'infiniteAmmo' },
            { id: '013', name: '无限生命！', description: '购买后本局触发炸弹不受伤害', price: 1000, rarity: 4, unlockAt: 9, type: 'infiniteLife' },
            { id: '014', name: '弓弩连发！', description: '购买后本局解锁连射', price: 500, rarity: 3, unlockAt: 6, type: 'rapidFire' },
            
            // 经济类
            { id: '015', name: '更多积分！', description: '购买后本局每关获得积分在结束结算时额外增加20%（上限为增加200%）', price: 700, rarity: 3, unlockAt: 12, type: 'scoreMultiplier', maxLevel: 10 },
            { id: '016', name: '更多钱！', description: '购买后本局每关胜利后获得钱额外增加10%（上限为增加200%）', price: 500, rarity: 2, unlockAt: 12, type: 'moneyMultiplier', maxLevel: 20 },
            { id: '017', name: '连击！', description: '消除时每次连击额外获得1积分', price: 700, rarity: 3, unlockAt: 12, type: 'comboBonus', maxOne: true },
            { id: '018', name: '冗余！', description: '玩家到达终点旗帜时剩余的弹药数量*5转换为本关积分，然后再判定本关是否达到积分要求', price: 500, rarity: 3, unlockAt: 9, type: 'ammoToScore', maxOne: true },
            { id: '019', name: '富有！', description: '本局之后每关结束时若玩家剩余金额大于1000，超出部分全部等量转换为积分，然后再判定本关是否达到积分要求', price: 1000, rarity: 3, unlockAt: 15, type: 'moneyToScore', maxOne: true },
            { id: '020', name: '收益！', description: '消除时每次连击额外获得5元', price: 1000, rarity: 3, unlockAt: 12, type: 'comboMoney' },
            
            // 一次性道具
            { id: '021', name: '一次性生命药水', description: '购买后下一关前三次触发炸弹不会受到伤害', price: 200, rarity: 2, unlockAt: 3, type: 'oneTimeBombImmunity', oneTime: true },
            { id: '022', name: '一次性免死金牌', description: '购买后下一关无论是否满足要求都一定通过', price: 500, rarity: 2, unlockAt: 3, type: 'oneTimeAutoWin', oneTime: true },
            { id: '023', name: '一次性白色使用券', description: '购买后下一关每次发射随机子弹为白色概率为1/5', price: 500, rarity: 2, unlockAt: 6, type: 'oneTimeWhiteChance', oneTime: true },
            { id: '024', name: '一次性无限弹药', description: '购买后下一关子弹数量无限', price: 700, rarity: 2, unlockAt: 6, type: 'oneTimeInfiniteAmmo', oneTime: true },
            { id: '025', name: '一次性满级炮台', description: '购买后下一关每次触发爆炸分裂时随机飞向的方向有8个，每个方向5枚子弹', price: 500, rarity: 2, unlockAt: 12, type: 'oneTimeMaxSplit', oneTime: true },
            { id: '026', name: '一次性连发体验券', description: '购买后下一关可使用连射', price: 100, rarity: 2, unlockAt: 12, type: 'oneTimeRapidFire', oneTime: true },
            { id: '027', name: '毁灭的救世主', description: '购买后下一关所有带数字的彩色方块变为无数字', price: 300, rarity: 3, unlockAt: 12, type: 'oneTimeRemoveNumbers', oneTime: true },
            { id: '028', name: '排雷兵', description: '购买后本局每关炸弹数量减少一颗', price: 200, rarity: 3, unlockAt: 9, type: 'reduceBombs' },
            { id: '029', name: '一次性排雷兵', description: '购买后下一关无炸弹', price: 300, rarity: 2, unlockAt: 9, type: 'oneTimeNoBombs', oneTime: true },
            { id: '030', name: '降低要求', description: '购买后下一关积分要求变为原来的1/2', price: 500, rarity: 2, unlockAt: 6, type: 'oneTimeHalfScoreReq', oneTime: true },
            { id: '031', name: '请愿', description: '购买后下一关任意颜色子弹均可触发任意颜色方块的消除', price: 1000, rarity: 5, unlockAt: 9, type: 'oneTimeUniversalColor', oneTime: true },
            { id: '032', name: '白色之心小型碎片', description: '购买后本局每关每次发射随机子弹为白色子弹概率增加1%', price: 200, rarity: 2, unlockAt: 6, type: 'whiteChanceIncrease' },
            { id: '033', name: '白色之心中型碎片', description: '购买后本局每关每次发射随机子弹为白色子弹概率增加2%', price: 300, rarity: 3, unlockAt: 6, type: 'whiteChanceIncrease' },
            { id: '034', name: '白色之心大型碎片', description: '购买后本局每关每次发射随机子弹为白色子弹概率增加5%', price: 500, rarity: 3, unlockAt: 6, type: 'whiteChanceIncrease' },
            { id: '035', name: '无敌体验卡', description: '购买后下一关同时获得连射、无限火力和无限生命三重效果。', price: 1000, rarity: 5, unlockAt: 12, type: 'oneTimeGodMode', oneTime: true }
        ];
        
        // 当前商店物品
        this.currentItems = [];
        
        // 重抽相关
        this.rerollCost = 150;
        this.rerollCount = 0;
        
        // 已购买的道具（本局生效）
        this.purchasedItems = [];
        this.oneTimeItems = []; // 一次性道具，只在下一关生效
        
        // 玩家已解锁的道具（跨局）
        this.unlockedItems = new Set(['001', '004', '007', '021']); // 初始解锁几个基础道具
    }
    
    // 生成商店物品（随机抽取3个）
    generateShopItems() {
        this.currentItems = [];
        this.rerollCount = 0;
        this.rerollCost = 150;
        
        // 过滤已解锁的道具
        const availableItems = this.items.filter(item => 
            this.unlockedItems.has(item.id) && 
            levelSystem.isLevelUnlocked(item.unlockAt)
        );
        
        if (availableItems.length === 0) {
            console.error("没有可用的商店物品！");
            return;
        }
        
        // 按稀有度概率抽取
        for (let i = 0; i < 3; i++) {
            let selectedItem = null;
            let attempts = 0;
            
            while (!selectedItem && attempts < 100) {
                const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
                const rarityRoll = Math.random() * 100;
                
                // 稀有度概率：1=70%, 2=50%, 3=30%, 4=15%, 5=5%
                let rarityChance;
                switch(randomItem.rarity) {
                    case 1: rarityChance = 70; break;
                    case 2: rarityChance = 50; break;
                    case 3: rarityChance = 30; break;
                    case 4: rarityChance = 15; break;
                    case 5: rarityChance = 5; break;
                    default: rarityChance = 50;
                }
                
                if (rarityRoll <= rarityChance) {
                    // 检查是否已抽取（避免重复）
                    if (!this.currentItems.some(item => item.id === randomItem.id)) {
                        selectedItem = randomItem;
                    }
                }
                
                attempts++;
            }
            
            // 如果尝试多次未找到，取第一个可用物品
            if (!selectedItem && availableItems.length > 0) {
                selectedItem = availableItems[0];
            }
            
            if (selectedItem) {
                this.currentItems.push(selectedItem);
            }
        }
    }
    
    // 重抽商店物品
    rerollShopItems() {
        this.rerollCount++;
        this.generateShopItems();
        this.rerollCost = 150 + (this.rerollCount * 50);
    }
    
    // 购买道具
    buyItem(itemId, playerMoney) {
        const item = this.currentItems.find(item => item.id === itemId);
        
        if (!item) {
            console.error("道具不存在:", itemId);
            return { success: false, message: "道具不存在" };
        }
        
        if (playerMoney < item.price) {
            return { success: false, message: "金币不足" };
        }
        
        // 检查是否已达到上限（对于有上限的道具）
        if (item.maxOne) {
            const alreadyPurchased = this.purchasedItems.some(p => p.type === item.type);
            if (alreadyPurchased) {
                return { success: false, message: "此道具只能购买一次" };
            }
        }
        
        if (item.maxLevel) {
            const currentLevel = this.getEffectLevel(item.type);
            if (currentLevel >= item.maxLevel) {
                return { success: false, message: "此道具已达到最大等级" };
            }
        }
        
        // 添加到已购买道具
        if (item.oneTime) {
            this.oneTimeItems.push(item);
        } else {
            this.purchasedItems.push(item);
        }
        
        // 播放购买音效
        audioManager.playPurchase();
        
        return { 
            success: true, 
            message: `购买成功: ${item.name}`,
            price: item.price,
            item: item
        };
    }
    
    // 获取道具效果
    getItemEffects() {
        const effects = {
            ammoBonus: 0,
            bombImmunity: 0,
            whiteChance: 0,
            whitePowerful: false,
            splitCount: 1,
            splitDirections: 3,
            infiniteAmmo: false,
            infiniteLife: false,
            rapidFire: false,
            scoreMultiplier: 1.0,
            moneyMultiplier: 1.0,
            comboBonus: 0,
            ammoToScore: false,
            moneyToScore: false,
            comboMoney: 0,
            reduceBombs: 0,
            whiteChanceIncrease: 0
        };
        
        // 应用所有已购买道具的效果
        this.purchasedItems.forEach(item => {
            switch(item.id) {
                case '001': effects.ammoBonus += 20; break;
                case '002': effects.ammoBonus += 50; break;
                case '003': effects.ammoBonus += 100; break;
                    
                case '004': effects.bombImmunity = Math.max(effects.bombImmunity, 1); break;
                case '005': effects.bombImmunity = Math.max(effects.bombImmunity, 2); break;
                case '006': effects.bombImmunity = Math.max(effects.bombImmunity, 3); break;
                    
                case '007': effects.whiteChance = 0.1; break;
                case '008': effects.whiteChance = 0.125; break;
                case '009': effects.whitePowerful = true; break;
                    
                case '010': effects.splitCount = Math.min(5, effects.splitCount + 1); break;
                case '011': effects.splitDirections = Math.min(8, effects.splitDirections + 1); break;
                    
                case '012': effects.infiniteAmmo = true; break;
                case '013': effects.infiniteLife = true; break;
                case '014': effects.rapidFire = true; break;
                    
                case '015': effects.scoreMultiplier = Math.min(3.0, effects.scoreMultiplier + 0.2); break;
                case '016': effects.moneyMultiplier = Math.min(3.0, effects.moneyMultiplier + 0.1); break;
                case '017': effects.comboBonus = 1; break;
                case '018': effects.ammoToScore = true; break;
                case '019': effects.moneyToScore = true; break;
                case '020': effects.comboMoney = 5; break;
                case '028': effects.reduceBombs = Math.min(3, effects.reduceBombs + 1); break;
                case '032': effects.whiteChanceIncrease += 0.01; break;
                case '033': effects.whiteChanceIncrease += 0.02; break;
                case '034': effects.whiteChanceIncrease += 0.05; break;
            }
        });
        
        return effects;
    }
    
    // 获取一次性道具效果
    getOneTimeEffects() {
        const effects = {
            bombImmunity: 0,
            autoWin: false,
            whiteChance: 0,
            infiniteAmmo: false,
            maxSplit: false,
            rapidFire: false,
            removeNumbers: false,
            noBombs: false,
            halfScoreReq: false,
            universalColor: false,
            godMode: false
        };
        
        // 应用一次性道具效果
        this.oneTimeItems.forEach(item => {
            switch(item.id) {
                case '021': effects.bombImmunity = Math.max(effects.bombImmunity, 3); break;
                case '022': effects.autoWin = true; break;
                case '023': effects.whiteChance = 0.2; break;
                case '024': effects.infiniteAmmo = true; break;
                case '025': effects.maxSplit = true; break;
                case '026': effects.rapidFire = true; break;
                case '027': effects.removeNumbers = true; break;
                case '029': effects.noBombs = true; break;
                case '030': effects.halfScoreReq = true; break;
                case '031': effects.universalColor = true; break;
                case '035': 
                    effects.rapidFire = true;
                    effects.infiniteAmmo = true;
                    effects.bombImmunity = 999; // 无限免疫
                    break;
            }
        });
        
        return effects;
    }
    
    // 获取效果等级
    getEffectLevel(effectType) {
        let level = 0;
        this.purchasedItems.forEach(item => {
            if (item.type === effectType) {
                level++;
            }
        });
        return level;
    }
    
    // 重置本局道具
    resetGame() {
        this.purchasedItems = [];
        this.oneTimeItems = [];
        this.rerollCount = 0;
        this.rerollCost = 150;
    }
    
    // 重置一次性道具（每关后清除）
    resetOneTimeItems() {
        this.oneTimeItems = [];
    }
    
    // 解锁新道具（当通过特定关卡时）
    unlockNewItems(levelId) {
        const newItems = this.items.filter(item => 
            item.unlockAt === levelId && !this.unlockedItems.has(item.id)
        );
        
        newItems.forEach(item => {
            this.unlockedItems.add(item.id);
            console.log(`已解锁新道具: ${item.name}`);
        });
        
        return newItems;
    }
    
    // 渲染商店界面
    renderShop(playerMoney) {
        const shopItemsElement = document.getElementById('shopItems');
        const shopMoneyElement = document.getElementById('shopMoney');
        const rerollCostElement = document.getElementById('rerollCost');
        
        // 更新金币显示
        shopMoneyElement.textContent = playerMoney;
        
        // 更新重抽价格
        rerollCostElement.textContent = this.rerollCost;
        
        // 清空当前物品
        shopItemsElement.innerHTML = '';
        
        // 生成商店物品HTML
        this.currentItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            
            // 检查是否可购买
            const canAfford = playerMoney >= item.price;
            let canBuy = canAfford;
            let reason = '';
            
            if (item.maxOne) {
                const alreadyPurchased = this.purchasedItems.some(p => p.type === item.type);
                if (alreadyPurchased) {
                    canBuy = false;
                    reason = '只能购买一次';
                }
            }
            
            if (item.maxLevel) {
                const currentLevel = this.getEffectLevel(item.type);
                if (currentLevel >= item.maxLevel) {
                    canBuy = false;
                    reason = '已达最大等级';
                }
            }
            
            itemElement.innerHTML = `
                <div class="shop-item-header">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-price">
                        <i class="fas fa-coins"></i>${item.price}
                    </div>
                </div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-rarity">
                    ${'★'.repeat(item.rarity)}${'☆'.repeat(5-item.rarity)}
                </div>
                <button class="shop-item-buy" data-item-id="${item.id}" 
                    ${!canBuy ? 'disabled' : ''}>
                    ${!canBuy ? (reason || '金币不足') : '购买'}
                </button>
            `;
            
            shopItemsElement.appendChild(itemElement);
        });
        
        // 添加购买事件监听
        document.querySelectorAll('.shop-item-buy').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                // 购买逻辑将在UI中处理
                if (typeof window.onShopItemBuy === 'function') {
                    window.onShopItemBuy(itemId);
                }
            });
        });
    }
}

// 创建全局商店系统实例
const shopSystem = new ShopSystem();