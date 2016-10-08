const APP_PORT = 8081;
var apiUrl = 'http://localhost:' + APP_PORT + '/';

var pageErrors = [];

var patrolData;
var accountInfo;
var socket;

chrome.tabs.onUpdated.addListener(injectDependenciesAfterPageLoaded);




/*
chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tab){
      chrome.tabs.executeScript(tab.id,{code:"document.title = 'My lame title!'"});
   }
);
*/


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.cmd) {
            case 'get_config_data':
                var response = {};
                chrome.storage.sync.get('config', function (items) {
                    console.log('get config:', JSON.stringify(items));
                    response.configData = items['config'];
                    console.log('get config - response', JSON.stringify(response));
                    
                    //sendResponse(response);

                sendResponse({data:123});    
                }); 
                               
                break;

            case 'update_config_data':
                var configData = request.value;
                chrome.storage.sync.set({ 'config': configData });
                break;
        }

        return true;
    });


function afterPatrolDataUpdated() {
    // todo: keep track of the active tab and only refresh/highlight the active one!
    chrome.windows.getAll({}, function (windows) {
        windows.forEach(function (window) {
            console.log('chrome.windows.getAll - wid=', window.id);

            chrome.tabs.query({ windowId: window.id }, function (tabs) {
                tabs.forEach(function (tab) {

                    console.log('________ tab.url', tab.url);
                    console.log('________ patrolData', patrolData);


                    var tabPatrolData = patrolData.filter(function (element) { return element.url === tab.url && element.text });
                    if (tabPatrolData.length > 0) {
                        console.log('________ afterPatrolDataUpdated= patrol data');
                        showPatrolDataInTab(tab, tabPatrolData);
                    } else {
                        console.log('________ showPatrolDataInTab=NONE');
                    }
                });
            });
        });
    });
}

// sends the message into the page - only after having checked that the dependencies are injected
function showPatrolDataInTab(tab, tabPatrolData) {
    console.log('________ showPatrolDataInTab=', tab.url, ' text=', tabPatrolData);

    chrome.tabs.get(tab.id, function (tab) {

        console.log('~~~', tab.url);
        console.log('~~~', dep_jquery[tab.id]);
        console.log('~~~', dep_page[tab.id]);

        if (dep_jquery[tab.id] === tab.url && dep_page[tab.id] === tab.url) {
            chrome.tabs.sendMessage(tab.id, tabPatrolData);
        }
        else
            setTimeout(function () {
                console.log('___ delay restart send message');
                showPatrolDataInTab(tab, tabPatrolData);
            }, 50);
    });
}

var dep_page = {};
var dep_jquery = {};

function injectDependenciesAfterPageLoaded(tabId, changeInfo, tab) {
    if (tab.url.startsWith("chrome://"))
        return;

    /*
        // http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
        if (changeInfo.status === "loading") {
            chrome.tabs.executeScript(tabId, { file: "jquery-2.1.4.min.js" }, function () {
                dep_jquery[tabId] = tab.url;
                chrome.tabs.executeScript(tabId, { file: "jquery.highlight-5.js" }, function () {
                    chrome.tabs.executeScript(tabId, { file: "page.js" }, function () {
                        dep_page[tabId] = tab.url;
                    });
                });
            });
        }
        */

    console.log('changeInfo.status=', changeInfo.status);

    //if (changeInfo.status === "loading"||changeInfo.status === "complete") {
    if (changeInfo.status === "complete") {
        chrome.tabs.executeScript(tabId, { file: "jquery-3.1.1.min.js" }, function () {
            dep_jquery[tabId] = tab.url;

            chrome.tabs.executeScript(tabId, { file: "jquery.highlight.js" }, function () {

                chrome.tabs.insertCSS(tabId, { code: ".social_patrol_highlight{background-color: yellow}" }, function () {

                    chrome.tabs.executeScript(tabId, { file: "page.js" }, function () {
                        dep_page[tabId] = tab.url;

                        afterPatrolDataUpdated();
                    });

                });
            });


        });
    }

}

chrome.tabs.create({ url: "chrome://extensions" });