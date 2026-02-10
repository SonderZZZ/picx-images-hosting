// ==UserScript==
// @name         哪吒详情页-只看网络图表
// @version      2.1
// @description  隐藏详情图表，直接展示网络波动卡片（适配新版HTML结构）
// @author       Modified by Gemini
// ==/UserScript==

(function () {
    'use strict';

    // "网络" 按钮选择器
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    // Tab 切换区域的 section 选择器
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';

    // 详情图表视图（CPU/内存/磁盘等）
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';

    // 网络图表视图
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;
    let divVisible = false;

    // 核心修改：强制隐藏详情，只显网络
    function forceOnlyNetworkVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.setProperty('display', 'none', 'important'); // 强制隐藏详情
            console.log('[UserScript] 详情图表已隐藏');
        }
        if (networkDiv) {
            networkDiv.style.setProperty('display', 'block', 'important'); // 强制显示网络
            console.log('[UserScript] 网络图表已显示');
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.display = 'none';
        }
    }

    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已切换至网络标签');
            // 切换后立即执行一次显示逻辑
            setTimeout(forceOnlyNetworkVisible, 50);
        }
    }

    function tryClickPeak(retryCount = 10, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
            console.log('[UserScript] 已点击 Peak 按钮');
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        const isAnyDivPresent = detailDiv || networkDiv;

        if (isAnyDivPresent && !divVisible) {
            hideTabSection();
            tryClickNetworkButton();
            setTimeout(() => tryClickPeak(15, 200), 300);
        } else if (!isAnyDivPresent && divVisible) {
            hasClicked = false;
        }

        divVisible = !!isAnyDivPresent;

        // 持续检测确保视图状态正确
        if (detailDiv || networkDiv) {
             forceOnlyNetworkVisible();
        }
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
    }
})();
