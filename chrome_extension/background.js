var rules = [];
var functionsText;

var dep_page = {};
var dep_jquery = {};

function updateGlobals(config) {
    try {
        rules = JSON.parse(config.rulesText);
        functionsText = config.functionsText;
    } catch (ex) { }
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    chrome.tabs.sendMessage(tab.id, { greeting: "Hi from background script" });
}

var title = "menu item";
var contextMenuId = chrome.contextMenus.create({ "title": title, "contexts": ["all"], "onclick": genericOnClick });

console.log('____233');

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.runtime.openOptionsPage();
});

chrome.storage.sync.get('config', function (items) {
    config = items['config'];

    if (config === undefined)
        config = {};

    updateGlobals(config);
    chrome.tabs.onUpdated.addListener(injectDependenciesAfterPageLoaded);
    chrome.tabs.onActivated.addListener(afterActivePageChanged);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            switch (request.cmd) {
                case 'get':
                    var response = {};
                    response.config = config;
                    sendResponse(response);
                    break;

                case 'update_rules':
                    config.rulesText = request.value;
                    updateGlobals(config);
                    chrome.storage.sync.set({ 'config': config });
                    break;

                case 'update_functions':
                    config.functionsText = request.value;
                    updateGlobals(config);
                    chrome.storage.sync.set({ 'config': config });
                    break;
            }

            return true;
        });
});

function isMatchRule(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

function afterTabUpdated(tabId) {
    console.log("__afterTabUpdated", tabId);
    chrome.tabs.get(tabId, function (tab) {
        console.log('rules BEGIN');

        chrome.contextMenus.update(contextMenuId, { "enabled": false });
        rules.some(function (rule) {
            console.log('rule url:' + rule.url + ' current url:' + tab.url);
            if (isMatchRule(tab.url, rule.url)) {
                console.log('match!: ' + JSON.stringify(rule));

                if (rule.contextMenu) {
                    chrome.contextMenus.update(contextMenuId, { "enabled": true });
                }

                if (dep_jquery[tab.id] === tab.url && dep_page[tab.id] === tab.url) {
                    rule.isSetChromeTitle = true;
                    chrome.tabs.sendMessage(tab.id, rule);

                    var rule2 = {};
                    rule2.isRevealMIDs = true;
                    chrome.tabs.sendMessage(tab.id, rule2);
                } else
                    setTimeout(function () {
                        console.log('___ delay restart send message');
                        afterTabUpdated(tabId);
                    }, 250);
                return true;
            }
        });

        console.log('rules END');
    });
}

function injectDependenciesAfterPageLoaded(tabId, changeInfo, tab) {
    if (tab.url.startsWith("chrome://"))
        return;

    console.log('changeInfo.status: ' + changeInfo);
    if (changeInfo.status === "loading" || changeInfo.status === "complete") {
        injectScriptsIntoTab(tabId, true);
    }
}

function injectScriptsIntoTab(tabId, forceInject) {
    console.log("injectScriptsIntoTab:", tabId);
    chrome.tabs.get(tabId, function (tab) {
        console.log("tab:", tab);
        console.log("tab.url:", tab.url);
        if (tab.url.startsWith('chrome://'))
            return;

        injectJqueryIfNeeded(tab,forceInject, function () {
            injectPageJsIfNeeded(tab,forceInject, function () {
                chrome.tabs.executeScript(tab.id, { code: functionsText }, function () {
                    chrome.tabs.insertCSS(tab.id, {
                        file: "styles.css"
                    }, function () {
                        afterTabUpdated(tab.id);
                    });

                });
            });
        });
    });
}

function injectJqueryIfNeeded(tab, forceInject, callback) {
    if (forceInject ||dep_jquery[tab.id] !== tab.url) {
        chrome.tabs.executeScript(tab.id, { file: "jquery-3.1.1.min.js" }, function () { callback(); });
        dep_jquery[tab.id] = tab.url;
        console.log('dep_jquery:[%s] = %s', tab.id, tab.url);
    } else {
        callback();
    }
}

function injectPageJsIfNeeded(tab, forceInject, callback) {
    if (forceInject || dep_page[tab.id] !== tab.url) {
        chrome.tabs.executeScript(tab.id, { file: "page.js" }, function () { callback(); });
        dep_page[tab.id] = tab.url;
        console.log('dep_page:[%s] = %s', tab.id, tab.url);
    } else {
        callback();
    }
}

function afterActivePageChanged(activeInfo) {
    injectScriptsIntoTab(activeInfo.tabId, false);
}

/*
chrome.tabs.create({ url: "chrome://extensions" });
chrome.tabs.create({ url: "http://hootsuite.com" });
*/