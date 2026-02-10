// ==UserScript==
// @name         哪吒详情页-纯净网络视图
// @version      3.1
// @description  基于提供的HTML结构修改：完全隐藏详情，只留网络图表
// @author       Gemini
// @match        *://*/server/*
// ==/UserScript==

(function () {
    'use strict';

    // 1. 定义基于你提供的 HTML 结构的精准选择器
    // 整个切换栏所在的 section
    const selectorTabSection = 'section.flex.items-center.my-2.w-full';
    // 包含“详情”和“网络”文字的按钮
    const selectorAllTabs = '.server-info-tab .relative.cursor-pointer';
    // 详情图表容器（通常带有 server-charts 类）
    const selectorDetailDiv = '.server-info > div:has(.server-charts)';
    // 网络图表容器（通常是 server-info 下的第三个直接子 div）
    const selectorNetworkDiv = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;

    // 核心函数：强制控制显示隐藏
    function applyViewCorrection() {
        const detailDiv = document.querySelector(selectorDetailDiv);
        const networkDiv = document.querySelector(selectorNetworkDiv);
        const tabSection = document.querySelector(selectorTabSection);

        // 隐藏“详情”图表
        if (detailDiv) {
            detailDiv.style.setProperty('display', 'none', 'important');
        }

        // 隐藏“切换栏” (你提供的那段 HTML)
        if (tabSection) {
            tabSection.style.setProperty('display', 'none', 'important');
        }

        // 确保“网络”图表显示
        if (networkDiv) {
            networkDiv.style.setProperty('display', 'block', 'important');
        }
    }

    // 自动点击“网络”按钮
    function switchToNetworkTab() {
        if (hasClicked) return;

        const tabs = document.querySelectorAll(selectorAllTabs);
        tabs.forEach(tab => {
            if (tab.textContent.includes('网络')) {
                tab.click();
                hasClicked = true;
                console.log('[UserScript] 已切换至网络视图');
            }
        });
    }

    // 自动点击 Peak 按钮
    function clickPeak() {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) peakBtn.click();
    }

    // 观察器：应对 React 动态渲染
    const observer = new MutationObserver(() => {
        const serverInfo = document.querySelector('.server-info');
        if (serverInfo) {
            switchToNetworkTab();
            applyViewCorrection();
            // 延迟执行 Peak 点击，确保图表已加载
            setTimeout(clickPeak, 500);
        }
    });

    const root = document.querySelector('#root') || document.body;
    observer.observe(root, {
        childList: true,
        subtree: true
    });

    // 初始执行一次
    applyViewCorrection();
})();
