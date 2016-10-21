var isAutoChange = false;

function updateRules() {
    if (isAutoChange)
        return;

    var rulesText = $('#rules').val();

    if (isRulesAValidObject(rulesText))
        chrome.runtime.sendMessage({ cmd: 'update_rules', value: rulesText });
}

function updateFunctions() {
    if (isAutoChange)
        return;

    var functionsText = $('#functions').val();
    chrome.runtime.sendMessage({ cmd: 'update_functions', value: functionsText });
}

function show() {
    chrome.runtime.sendMessage({ cmd: 'get' }, function (response) {
        var rulesElem = $('#rules');
var functionsElem = $('#functions');

        isAutoChange = true;        
        rulesElem.text(response.config.rulesText);
        functionsElem.text(response.config.functionsText);
        isAutoChange = false;

        isRulesAValidObject(response.config.rulesText);
    });
}

function isRulesAValidObject(rulesText) {
    try {
        var rulesObj = JSON.parse(rulesText);
        document.body.className = 'valid';
        return true;

    } catch (ex) {
        document.body.className = 'invalid';
        console.error('json error:' + ex);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    show();

    $('#rules').keyup(function () { updateRules($(this).val()); });
    $('#functions').keyup(function () { updateFunctions($(this).val()); });
});

/*
chrome.tabs.create({ url: "https://www.google.ca/search?q=hootsuite" });
chrome.tabs.create({ url: "chrome://extensions" });
*/