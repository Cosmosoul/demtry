// 商店系统
class ShopSystem {
    constructor() {
        // 商品数据（基于提供的表格）
        this.items = [
            // 弹药包
            { id: '001', name: '小型弹药包', description: '购买后本局每关弹药增加20枚', price: 100, rarity: 1, unlockAt: 1 },
            { id: '002', name: '中型弹药包', description: '购买后本局每关弹药增加50枚', price: 200, rarity: 1, unlockAt: 3 },
            { id: '003', name: '大型弹药包', description: '购买后本局每关弹药增加100枚', price: 350, rarity: 2, unlockAt: 6 },
            
            // 生命药水
            { id: '004', name: '小型生命药水', description: '购买后本局每关第一次触发炸弹不会受到伤害', price: 150, rarity: 1, unlockAt: 1 },
            { id: '005', name: '中型生命药水', description: '购买后本局每关前两次触发炸弹不会受到伤害', price: 250, rarity: 2, unlockAt: 4 },
            { id: '006', name: '大型生命药水', description: '购买后本局每关前三次触发炸弹不会受到伤害', price: 400, rarity: 3, unlockAt: 8 },
            
            // 白色子弹相关
            { id: '007', name: '白色！', description: '购买后本局每次发射随机子弹有1/10概率为白色子弹', price: 200, rarity: 1, unlockAt: 2 },
            { id: '008', name: '更多的白色！', description: '购买后本局每次发射随机子弹有1/8概率为白色子弹', price: 300, rarity: 2, unlockAt: 5 },
            { id: '009', name: '更强的白色！', description: '购买后本局白色子弹可以使全部颜色触发爆炸分裂', price: 500, rarity: 3, unlockAt: 9 },
            
            // 分裂相关
            { id: '010', name: '分裂！', description: '购买后本局每次触发爆炸分裂时产生的粒子每个方向数量+1', price: 250, rarity: 2, unlockAt: 4 },
            { id: '011', name: '激进分裂！', description: '购买后本局每次触发爆炸分裂时产生的粒子随机飞向的方向+1（上限为8）', price: 400, rarity: 3, unlockAt: 7 },
            
            // 特殊能力
            { id: '012', name: '无限火力！', description: '购买后本局无弹药限制', price: 1000, rarity: 3, unlockAt: 10 },
            { id: '013', name: '无限生命！', description: '购买后本局触发炸弹不受伤害', price: 800, rarity: 3, unlockAt: 12 },
            { id: '014', name: '弓弩连发！', description: '购买后本局解锁连射', price: 300, rarity: 2, unlockAt: 5 },
            
            // 经济类
            { id: '015', name: '更多积分！', description: '购买后本局每关获得积分额外增加20%', price: 350, rarity: 2, unlockAt: 6 },
            { id: '016', name: '更多钱！', description: '购买后本局每关胜利后获得钱额外增加10%', price: 400, rarity: 2, unlockAt: 7 }
        ];
        
        // 当前商店物品
        this.currentItems = [];
        
        // 重抽相关
        this.rerollCost = 150;
        this.rerollCount = 0;
        
        // 已购买的道具（本局生效）
        this.purchasedItems = [];
        
        // 玩家已解锁的道具（跨局）
        this.unlockedItems = new Set(['001', '004', '007']); // 初始解锁几个基础道具
    }
    
    // 生成商店物品（随机抽取2个）
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
        for (let i = 0; i < 2; i++) {
            let selectedItem = null;
            let attempts = 0;
            
            while (!selectedItem && attempts < 100) {
                const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
                const rarityRoll = Math.random() * 100;
                
                // 稀有度概率：1=50%, 2=30%, 3=20%
                let rarityChance;
                switch(randomItem.rarity) {
                    case 1: rarityChance = 50; break;
                    case 2: rarityChance = 30; break;
                    case 3: rarityChance = 20; break;
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
    
    // 在shop.js的buyItem方法中添加道具效果提示
// 在 shop.js 的 buyItem 方法中添加以下内容
buyItem(itemId, playerMoney) {
    const item = this.currentItems.find(item => item.id === itemId);
    
    if (!item) {
        console.error("道具不存在:", itemId);
        return { success: false, message: "道具不存在" };
    }
    
    if (playerMoney < item.price) {
        return { success: false, message: "金币不足" };
    }
    
    // 添加到已购买道具
    this.purchasedItems.push(item);
    
    // 立即应用道具效果到当前游戏
    if (typeof gameCore !== 'undefined' && typeof gameCore.applyShopEffects === 'function') {
        gameCore.applyShopEffects();
    }
    
    // 播放购买音效
    audioManager.playPurchase();
    
    // 显示道具效果提示
    if (typeof gameCore !== 'undefined' && typeof gameCore.showItemEffectMessage === 'function') {
        gameCore.showItemEffectMessage(item.name);
    }
    
    return { 
        success: true, 
        message: `购买成功: ${item.name}`,
        price: item.price,
        item: item
    };
}
    
    // 在shop.js的getItemEffects方法中，修复分裂和连射效果
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
        moneyMultiplier: 1.0
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
                
            case '010': effects.splitCount = Math.max(effects.splitCount, 2); break; // 修复分裂计数
            case '011': effects.splitDirections = Math.min(8, Math.max(effects.splitDirections, 4)); break; // 修复分裂方向
                
            case '012': effects.infiniteAmmo = true; break;
            case '013': effects.infiniteLife = true; break;
            case '014': effects.rapidFire = true; break;
                
            case '015': effects.scoreMultiplier = Math.max(effects.scoreMultiplier, 1.2); break;
            case '016': effects.moneyMultiplier = Math.max(effects.moneyMultiplier, 1.1); break;
        }
    });
    
    return effects;
}
    
    // 重置本局道具
    resetGame() {
        this.purchasedItems = [];
        this.rerollCount = 0;
        this.rerollCost = 150;
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
            itemElement.innerHTML = `
                <div class="shop-item-header">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-price">
                        <i class="fas fa-coins"></i>${item.price}
                    </div>
                </div>
                <div class="shop-item-description">${item.description}</div>
                <button class="shop-item-buy" data-item-id="${item.id}" 
                    ${playerMoney < item.price ? 'disabled' : ''}>
                    ${playerMoney < item.price ? '金币不足' : '购买'}
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