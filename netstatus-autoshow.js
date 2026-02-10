// ==UserScript==
// @name         哪吒详情页-只看网络图表
// @version      2.1
// @description  基于原脚本修改：隐藏详情图表，只保留网络波动卡片
// @author       https://www.nodeseek.com/post-349102-1
// ==/UserScript==

(function () {
    'use strict';

    // 选择器保持原脚本不变
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;
    let divVisible = false;

    // 修改：只让网络视图显示，强行隐藏详情视图
    function forceOnlyNetworkVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            // 这里改为 none，并加上 !important 属性防止被 React 还原
            detailDiv.style.setProperty('display', 'none', 'important');
        }
        if (networkDiv) {
            // 确保网络图表显示
            networkDiv.style.setProperty('display', 'block', 'important');
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.setProperty('display', 'none', 'important');
        }
    }

    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已触发网络按钮点击');
            // 点击后需要一小段时间等 DOM 渲染
            setTimeout(forceOnlyNetworkVisible, 100);
        }
    }

    function tryClickPeak(retryCount = 10, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        const isAnyDivVisible = (detailDiv && getComputedStyle(detailDiv).display !== 'none') || 
                                (networkDiv && getComputedStyle(networkDiv).display !== 'none');

        if (isAnyDivVisible && !divVisible) {
            hideTabSection();
            tryClickNetworkButton();
            setTimeout(() => tryClickPeak(15, 200), 300);
        } else if (!isAnyDivVisible && divVisible) {
            hasClicked = false;
        }

        divVisible = isAnyDivVisible;

        // 核心：只要检测到这两个 div，就执行“隐藏详情、显示网络”
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
