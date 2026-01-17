// 主入口文件 - 游戏初始化（手机竖屏优化）
document.addEventListener('DOMContentLoaded', () => {
    console.log('链式反应迷宫 v2.0 - 手机竖屏优化版已加载');
    
    // 检测设备类型
    const isMobile = this.detectMobileDevice();
    
    if (isMobile) {
        console.log('移动设备检测成功，应用移动优化');
        this.applyMobileOptimizations();
    }
    
    // 初始化所有系统
    // UI系统已在ui.js中自动初始化
    // 音频系统已在audio.js中自动初始化
    
    // 添加加载完成提示
    setTimeout(() => {
        console.log('所有系统初始化完成，游戏已就绪');
        console.log('设备类型:', isMobile ? '移动设备' : '桌面设备');
    }, 100);
    
    // 节拍闪烁效果（根据设备调整频率）
    const bpmInterval = isMobile ? 600 : 500; // 移动设备降低频率
    setInterval(() => {
        // 为所有颜色方块添加闪烁效果
        const colorCells = document.querySelectorAll('.cell.color');
        colorCells.forEach(cell => {
            cell.style.animationPlayState = 'running';
            
            // 短暂高亮
            const originalBoxShadow = cell.style.boxShadow;
            cell.style.boxShadow = originalBoxShadow + ', 0 0 20px rgba(255, 255, 255, 0.8)';
            
            setTimeout(() => {
                cell.style.boxShadow = originalBoxShadow;
            }, 100);
        });
    }, bpmInterval);
    
    // 添加方块呼吸效果（与节拍同步）
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        // 为每个方块设置不同的动画延迟，创建波浪效果
        cell.style.animationDelay = `${(index % 10) * 0.05}s`;
    });
    
    // 添加触摸优化
    this.addTouchOptimizations();
    
    // 监听窗口大小变化和方向变化
    this.addResizeAndOrientationListeners();
});

// 检测移动设备
function detectMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (window.innerWidth <= 768);
}

// 应用移动设备优化
function applyMobileOptimizations() {
    // 添加移动设备CSS类
    document.body.classList.add('mobile-device');
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // 防止页面滚动（游戏区域内）
    document.addEventListener('touchmove', (e) => {
        // 检查是否在游戏网格内
        const gridContainer = document.getElementById('gridContainer');
        if (gridContainer && (e.target === gridContainer || gridContainer.contains(e.target))) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 调整字体大小
    if (window.innerWidth <= 320) {
        document.documentElement.style.fontSize = '14px';
    } else if (window.innerWidth <= 375) {
        document.documentElement.style.fontSize = '15px';
    } else {
        document.documentElement.style.fontSize = '16px';
    }
    
    // 添加CSS变量用于设备适配
    const root = document.documentElement;
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 0px)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 0px)');
    root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left, 0px)');
    root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right, 0px)');
}

// 添加触摸优化
function addTouchOptimizations() {
    // 优化按钮触摸反馈
    const buttons = document.querySelectorAll('button, .menu-btn, .pause-menu-btn, .result-btn, .shop-item-buy, .shop-control-btn, .fail-btn, .completion-btn');
    
    buttons.forEach(button => {
        // 确保触摸目标足够大
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
        
        // 添加触摸反馈
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.9';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
    });
    
    // 优化滑动体验
    const scrollableElements = document.querySelectorAll('.help-container, .settings-container, .shop-popup');
    
    scrollableElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            // 记录触摸开始位置
            this.touchStartY = e.touches[0].clientY;
            this.scrollTop = this.scrollTop;
        }, { passive: true });
        
        element.addEventListener('touchmove', function(e) {
            if (!this.touchStartY) return;
            
            const touchY = e.touches[0].clientY;
            const diff = this.touchStartY - touchY;
            
            // 只有垂直滚动
            this.scrollTop = this.scrollTop + diff;
            this.touchStartY = touchY;
        }, { passive: true });
    });
}

// 添加窗口大小和方向变化监听
function addResizeAndOrientationListeners() {
    let resizeTimeout;
    let orientationWarningShown = false;
    
    // 检查当前方向并显示提示
    function checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const orientationWarning = document.getElementById('orientation-warning');
        
        if (orientationWarning) {
            if (!isPortrait && detectMobileDevice()) {
                orientationWarning.style.display = 'flex';
                orientationWarningShown = true;
            } else {
                orientationWarning.style.display = 'none';
                orientationWarningShown = false;
            }
        }
        
        // 添加方向CSS类
        if (isPortrait) {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        } else {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        }
        
        // 重新计算游戏网格大小
        if (typeof gameCore !== 'undefined') {
            if (gameCore.calculateCellSize) {
                gameCore.calculateCellSize();
            }
            if (gameCore.updateLauncherColor) {
                gameCore.updateLauncherColor();
            }
        }
    }
    
    // 初始检查
    checkOrientation();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkOrientation();
        }, 250);
    });
    
    // 监听设备方向变化（移动设备）
    if (window.orientation !== undefined) {
        window.addEventListener('orientationchange', () => {
            // 等待旋转完成
            setTimeout(checkOrientation, 100);
        });
    }
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停游戏
            if (typeof gameCore !== 'undefined' && gameCore.state && gameCore.state.active) {
                if (typeof uiManager !== 'undefined' && uiManager.showPauseMenu) {
                    uiManager.showPauseMenu();
                }
            }
        }
    });
}

// 防止文本选择（提升触摸体验）
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
}, false);

// 优化移动设备性能
if (detectMobileDevice()) {
    // 减少一些动画以提高性能
    const style = document.createElement('style');
    style.textContent = `
        .mobile-device .projectile {
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor !important;
        }
        
        .mobile-device .explosion {
            animation-duration: 0.3s !important;
        }
        
        .mobile-device .score-gain {
            font-size: 20px !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加游戏性能监控（仅开发时）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function updateFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // 只在帧率过低时警告
            if (fps < 25 && typeof gameCore !== 'undefined' && gameCore.state && gameCore.state.active) {
                console.warn(`低帧率警告: ${fps} FPS`);
            }
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    // 开始监控
    updateFPS();
}

// 导出全局函数供其他模块调用
window.detectMobileDevice = detectMobileDevice;
window.checkOrientation = function() {
    // 调用内部函数
    const orientationWarning = document.getElementById('orientation-warning');
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (orientationWarning) {
        if (!isPortrait && detectMobileDevice()) {
            orientationWarning.style.display = 'flex';
        } else {
            orientationWarning.style.display = 'none';
        }
    }
};

// 添加CSS动画定义
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        30% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
    }
    
    .mobile-device .item-effect-message {
        font-size: 16px !important;
        padding: 12px 20px !important;
    }
    
    /* 优化触摸区域 */
    .cell {
        -webkit-tap-highlight-color: transparent;
    }
    
    /* 安全区域适配 */
    .screen {
        padding-top: var(--safe-area-top, 0px);
        padding-bottom: var(--safe-area-bottom, 0px);
        padding-left: var(--safe-area-left, 0px);
        padding-right: var(--safe-area-right, 0px);
    }
    
    .game-header {
        padding-top: max(10px, var(--safe-area-top, 0px)) !important;
    }
    
    .pause-btn, .sound-toggle {
        bottom: max(20px, var(--safe-area-bottom, 20px)) !important;
    }
`;
document.head.appendChild(style);

console.log('脚本初始化完成，游戏准备就绪');