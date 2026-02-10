// ==UserScript==
// @version      2.3
// @description  哪吒详情页只显示网络波动卡片（保留原逻辑，隐藏详情图表）
// @author       https://www.nodeseek.com/post-349102-1
// ==/UserScript==

(function () {
    'use strict';

    // "网络" 按钮选择器（未激活状态下灰色文字）
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    // Tab 切换区域选择器
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';

    // 网络图表 div（第3个 div）
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;
    let divVisible = false;

    // 只显示网络图表
    function forceNetworkVisible() {
        const networkDiv = document.querySelector(selectorNetworkCharts);
        if (networkDiv) {
            networkDiv.style.display = 'block';
            console.log('[UserScript] 网络图表已显示');
        }
    }

    // 隐藏 Tab 区域
    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.display = 'none';
            console.log('[UserScript] Tab 切换区域已隐藏');
        }
    }

    // 点击网络按钮
    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已点击网络按钮');
            setTimeout(forceNetworkVisible, 500); // 只显示网络图表
        }
    }

    // 点击 Peak 按钮（带重试）
    function tryClickPeak(retryCount = 10, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
            console.log('[UserScript] 已点击 Peak 按钮');
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    // MutationObserver 保留原逻辑，只隐藏详情部分
    const observer = new MutationObserver(() => {
        const networkDiv = document.querySelector(selectorNetworkCharts);
        const isNetworkVisible = networkDiv && getComputedStyle(networkDiv).display !== 'none';

        if (isNetworkVisible && !divVisible) {
            hideTabSection();
            tryClickNetworkButton();
            setTimeout(() => tryClickPeak(15, 200), 300);
        } else if (!isNetworkVisible && divVisible) {
            hasClicked = false;
        }

        divVisible = isNetworkVisible;
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
        console.log('[UserScript] 观察器已启动');
    }
})();
