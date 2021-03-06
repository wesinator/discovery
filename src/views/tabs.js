/* eslint-env browser */

export default function(discovery) {
    discovery.view.define('tabs', function(el, config, data, context) {
        function renderContent(value) {
            const handler = inited ? onChange : onInit;

            if (currentValue === value) {
                return;
            }

            const renderContext = beforeTabs || afterTabs || content
                ? { ...context, [name]: value }
                : null;

            currentValue = value;
            inited = true;

            if (Array.isArray(tabs)) {
                tabsEl.innerHTML = '';

                if (beforeTabs) {
                    beforeTabsEl.innerHTML = '';
                    discovery.view.render(beforeTabsEl, beforeTabs, data, renderContext);
                    tabsEl.appendChild(beforeTabsEl);
                }

                tabs.forEach(tab =>
                    discovery.view.render(tabsEl, discovery.view.composeConfig({
                        view: 'tab',
                        active: tab.value === currentValue,
                        content: tab.content,
                        onClick: renderContent
                    }, tabConfig), tab, context)
                );

                if (afterTabs) {
                    afterTabsEl.innerHTML = '';
                    discovery.view.render(afterTabsEl, afterTabs, data, renderContext);
                    tabsEl.appendChild(afterTabsEl);
                }
            }

            if (content) {
                contentEl.innerHTML = '';
                discovery.view.render(contentEl, content, data, renderContext);
            }

            if (typeof handler === 'function') {
                handler(currentValue, name);
            }
        }

        const { content, beforeTabs, afterTabs, tabConfig, onInit, onChange } = config;
        let { name, tabs } = config;
        const tabsEl = el.appendChild(document.createElement('div'));
        let contentEl = null;
        let beforeTabsEl = null;
        let afterTabsEl = null;
        let inited = false;
        let currentValue = NaN;
        let initValue =
            'value' in config
                ? config.value
                : name in context
                    ? context[name]
                    : undefined;

        tabsEl.className = 'view-tabs-buttons';

        if (beforeTabs) {
            beforeTabsEl = document.createElement('div');
            beforeTabsEl.className = 'view-tabs-buttons-before';
        }

        if (afterTabs) {
            afterTabsEl = document.createElement('div');
            afterTabsEl.className = 'view-tabs-buttons-after';
        }

        if (content) {
            contentEl = el.appendChild(document.createElement('div'));
            contentEl.className = 'view-tabs-content';
        }

        if (typeof name !== 'string') {
            name = 'filter';
        }

        if (Array.isArray(tabs)) {
            tabs = tabs.map(tab => {
                const type = typeof tab;

                if (type === 'string' || type === 'number' || type === 'boolean') {
                    tab = { value: tab };
                }

                if (initValue === undefined || tab.active) {
                    initValue = tab.value;
                }

                return tab;
            });
        } else {
            tabs = [];
        }

        renderContent(initValue);
    });
}
