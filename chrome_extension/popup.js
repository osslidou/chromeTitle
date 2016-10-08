var isAutoChange = false;

function updateConfig() {
    if (isAutoChange)
        return;

    var configObj = getConfigObj();
    if (configObj)
        chrome.runtime.sendMessage({ cmd: 'update_config_data', value: configObj });
}

function getConfigObj() {
    var configText = $('#configText').val();
    console.log('getConfigObj: ' + configText);

    try {
        var configObj = JSON.parse(configText);
        document.body.className = 'valid';
        return configObj;

    } catch (ex) {
        document.body.className = 'invalid';
        console.error(ex);
    }
}

function show() {
    chrome.runtime.sendMessage({ cmd: 'get_config_data' }, function (response) {
        console.log('data: ' + JSON.stringify(response));

        var configTextElem = $('#configText');
        var configData = response.configData;
        var configText = JSON.stringify(configData)

        isAutoChange = true;
        configTextElem.text(configText);
        isAutoChange = false;

        getConfigObj();
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