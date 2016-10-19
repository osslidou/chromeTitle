var isAutoChange = false;

function updateConfig() {
    if (isAutoChange)
        return;

    var configObj = checkAndGetConfigObj();
    if (configObj)
        chrome.runtime.sendMessage({ cmd: 'update_rules', value: configObj });
}

function checkAndGetConfigObj() {
    var configText = $('#configText').val();

    try {
        var configObj = JSON.parse(configText);
        document.body.className = 'valid';
        return configObj;

    } catch (ex) {
        document.body.className = 'invalid';
        console.error('json error:' + ex);
    }
}

function show() {
    chrome.runtime.sendMessage({ cmd: 'get_rules' }, function (response) {
        var rules = response.rules;
        var configText = JSON.stringify(rules)

        isAutoChange = true;
        var configTextElem = $('#configText');
        configTextElem.text(configText);
        isAutoChange = false;

        checkAndGetConfigObj();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    show();

    $('#configText').keyup(function (e) {
        updateConfig($(this).val());
    });
});

/*
chrome.tabs.create({ url: "https://www.google.ca/search?q=hootsuite" });
chrome.tabs.create({ url: "chrome://extensions" });
*/