const APP_PORT = 8081;
var apiUrl = 'http://localhost:' + APP_PORT + '/';

var accountInfo;
var rules = [];
var functionsText;

var dep_page = {};
var dep_jquery = {};
var counter = 0;

function updateGlobals(config) {
    try {
        rules = JSON.parse(config.rulesText);
        functionsText = config.functionsText;
    } catch (ex) { }
}

chrome.storage.sync.get('config', function (items) {
    console.log('loadingItems: ', items);
    config = items['config'];

    if (config === undefined)
        config = {};

    updateGlobals(config);
    console.log('loadingConfig: ', config);

    chrome.tabs.onUpdated.addListener(injectDependenciesAfterPageLoaded);

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
    chrome.tabs.get(tabId, function (tab) {
        console.log('rules BEGIN');

        rules.some(function (rule) {
            console.log('rule url:' + rule.url + ' current url:' + tab.url);
            if (isMatchRule(tab.url, rule.url)) {
                console.log('match!: ' + JSON.stringify(rule));

                if (dep_jquery[tab.id] === tab.url && dep_page[tab.id] === tab.url)
                    chrome.tabs.sendMessage(tab.id, rule);

                else
                    setTimeout(function () {
                        console.log('___ delay restart send message');
                        afterTabUpdated(tabId);
                    }, 50);
                return true;
            }
        });

        console.log('rules END');
    });
}

function injectDependenciesAfterPageLoaded(tabId, changeInfo, tab) {
    if (tab.url.startsWith("chrome://"))
        return;

    console.log('changeInfo.status: ' + changeInfo.status);
    if (changeInfo.status === "loading" || changeInfo.status === "complete") {
        //if (changeInfo.status === "loading") {
        chrome.tabs.executeScript(tabId, { file: "jquery-3.1.1.min.js" }, function () {
            dep_jquery[tabId] = tab.url;
            chrome.tabs.executeScript(tabId, { file: "page.js" }, function () {
                dep_page[tabId] = tab.url;

                chrome.tabs.executeScript(tabId, { code: functionsText }, function () {
                    afterTabUpdated(tabId);
                });

            });
        });
    }
}

/*
chrome.tabs.create({ url: "chrome://extensions" });
chrome.tabs.create({ url: "http://hootsuite.com" });
*/