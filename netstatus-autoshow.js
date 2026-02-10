// ==UserScript==
// @name         哪吒详情页-极简网络视图
// @version      3.0
// @description  强制隐藏详情，只留网络波动图表
// @author       Gemini
// @match        *://*/server/* // @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // 1. 注入强制 CSS：直接从底层封死“详情图表”和“切换栏”
    // .server-charts 是详情图表的特征类名
    const style = `
        /* 隐藏切换标签栏 */
        .server-info section.flex.items-center.my-2.w-full { display: none !important; }
        
        /* 隐藏包含详情图表的容器 */
        div:has(> .server-charts) { display: none !important; }
        
        /* 确保网络图表容器可见 */
        .server-info > div:nth-last-child(1) { display: block !important; }
    `;
    
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);

    // 2. 自动点击逻辑
    function initializeView() {
        // 寻找包含“网络”字样的按钮并点击
        const buttons = document.querySelectorAll('.server-info-tab .relative.cursor-pointer');
        buttons.forEach(btn => {
            if (btn.textContent.includes('网络')) {
                btn.click();
            }
        });

        // 尝试点击 Peak 按钮（24小时视图）
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) peakBtn.click();
    }

    // 3. 使用定时监听（解决单页应用路由切换不触发刷新的问题）
    let lastPath = "";
    setInterval(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/server/') && document.querySelector('.server-info')) {
            // 如果路径变了，或者网络视图还没出来，就执行一次
            const networkDiv = document.querySelector('.server-info > div:nth-last-child(1)');
            if (lastPath !== currentPath || (networkDiv && getComputedStyle(networkDiv).display === 'none')) {
                initializeView();
                lastPath = currentPath;
            }
        }
    }, 1000);

})();
