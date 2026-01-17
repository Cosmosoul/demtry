// 主入口文件 - 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('链式反应迷宫 v2.0 已加载');
    
    // 设备检测
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        console.log('移动设备检测，应用移动端优化');
        
        // 添加移动端特定优化
        if (isPortrait) {
            document.body.classList.add('portrait-mode');
            document.body.classList.remove('landscape-mode');
            console.log('竖屏模式');
        } else {
            document.body.classList.add('landscape-mode');
            document.body.classList.remove('portrait-mode');
            console.log('横屏模式');
        }
        
        // 优化触摸延迟 - 使用FastClick
        if (typeof FastClick !== 'undefined') {
            FastClick.attach(document.body);
            console.log('FastClick已启用');
        }
        
        // 添加移动端提示
        if (isPortrait) {
            console.log('建议横屏游玩以获得更好体验');
        }
    } else {
        console.log('桌面设备，保持PC端体验');
    }
    
    // 初始化所有系统
    // UI系统已在ui.js中自动初始化
    // 音频系统已在audio.js中自动初始化
    
    // 添加加载完成提示
    setTimeout(() => {
        console.log('所有系统初始化完成，游戏已就绪');
        
        // 显示设备信息
        console.log('屏幕尺寸:', window.innerWidth, 'x', window.innerHeight);
        console.log('设备像素比:', window.devicePixelRatio);
    }, 100);
    
    // 添加节拍闪烁效果（BPM=120，每拍0.5秒）
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
    }, 500); // 每0.5秒一次
    
    // 添加方块呼吸效果（与节拍同步）
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        // 为每个方块设置不同的动画延迟，创建波浪效果
        cell.style.animationDelay = `${(index % 10) * 0.05}s`;
    });
    
    // 窗口大小改变监听
    window.addEventListener('resize', () => {
        const isPortraitNow = window.innerHeight > window.innerWidth;
        const isMobileNow = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobileNow) {
            if (isPortraitNow) {
                document.body.classList.add('portrait-mode');
                document.body.classList.remove('landscape-mode');
            } else {
                document.body.classList.add('landscape-mode');
                document.body.classList.remove('portrait-mode');
            }
        }
        
        // 通知游戏重新计算单元格大小
        if (gameCore && typeof gameCore.calculateCellSize === 'function') {
            gameCore.calculateCellSize();
        }
        if (gameCore && typeof gameCore.updateLauncherColor === 'function') {
            gameCore.updateLauncherColor();
        }
    });
    
    // 防止移动端缩放
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});