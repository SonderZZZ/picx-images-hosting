// ==UserScript==
// @name         哪吒详情页-只看网络(终极版)
// @version      4.0
// @description  强制隐藏详情栏，自动切换并展示网络波动图
// @author       Gemini
// @match        *://*/server/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // 1. 【核心】注入 CSS 样式，直接从底层封杀详情栏和切换栏
    // 使用 !important 确保 React 无法通过内联样式改回显示
    GM_addStyle(`
        /* 隐藏切换标签栏（包含 详情/网络 按钮的那一行） */
        section.flex.items-center.my-2.w-full { 
            display: none !important; 
        }

        /* 隐藏详情图表容器（根据你提供的 server-charts 类名锁定） */
        div:has(> section.server-charts) {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* 确保网络图表容器（详情的兄弟节点）保持显示 */
        /* 哪吒新版布局中，网络图表通常在详情图表的下一个相邻 div 中 */
        div:has(> section.server-charts) + div {
            display: block !important;
        }
    `);

    // 2. 自动点击逻辑
    function doAutoActions() {
        // A. 自动点击“网络”标签
        // 我们通过文字匹配，因为 class 可能会变，但文字“网络”不会变
        const allDivs = document.querySelectorAll('.server-info-tab div, .server-info-tab p');
        allDivs.forEach(el => {
            if (el.innerText === '网络' || el.innerText === 'Network') {
                // 向上找那个带 cursor-pointer 的容器并点击
                const btn = el.closest('.cursor-pointer');
                if (btn) btn.click();
            }
        });

        // B. 自动点击“Peak”按钮
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) peakBtn.click();
    }

    // 3. 监听 DOM 变化（应对单页应用切换服务器的情况）
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        // 如果页面 URL 变了，或者检测到图表加载了
        if (location.href !== lastUrl || document.querySelector('.server-charts')) {
            lastUrl = location.href;
            doAutoActions();
        }
    });

    // 开始监听
    const targetNode = document.querySelector('#root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    // 初始执行
    setTimeout(doAutoActions, 300);

})();
