// ==UserScript==
// @version      2.2
// @description  哪吒详情页只显示网络图表，隐藏详情和 Tab 区域，自动点击 Peak
// @author       nodeseek
// ==/UserScript==

(function () {
    'use strict';

    // 网络图表选择器（通常是第3个 div）
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    // Tab 区域选择器
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';

    // 是否已经处理过
    let divVisible = false;

    // 显示网络图表
    function showNetwork() {
        const networkDiv = document.querySelector(selectorNetworkCharts);
        if (networkDiv) {
            networkDiv.style.display = 'block';
            console.log('[UserScript] 网络图表已显示');
        }
    }

    // 隐藏 Tab 区域
    function hideTab() {
        const tab = document.querySelector(selectorTabSection);
        if (tab) {
            tab.style.display = 'none';
            console.log('[UserScript] Tab 区域已隐藏');
        }
    }

    // 自动点击 Peak 按钮
    function clickPeak(retry = 15, interval = 200) {
        const btn = document.querySelector('#Peak');
        if (btn) {
            btn.click();
            console.log('[UserScript] Peak 按钮已点击');
        } else if (retry > 0) {
            setTimeout(() => clickPeak(retry - 1, interval), interval);
        }
    }

    // 观察网络图表加载
    const observer = new MutationObserver(() => {
        const networkDiv = document.querySelector(selectorNetworkCharts);
        if (networkDiv && !divVisible) {
            showNetwork();
            hideTab();
            clickPeak();
            divVisible = true;
        }
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style','class'] });
        console.log('[UserScript] 观察器已启动');
    }
})();
