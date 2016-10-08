
if (!document.hasRun) {
    // add listener only once!
    console.log('onMessage listener added');

    chrome.runtime.onMessage.addListener(messageListener);
    document.hasRun = true;
}

// function that waits for events from background extension worker
function messageListener(request, sender, sendResponse) {
    try {

        console.log('incoming command: ' + JSON.stringify(request));

request.forEach(function(entry){
    console.log('value command: ' + entry.text);
    $('body').highlight( entry.text);
});


        /*
                var data = request.data;
        
                
                var node = getNodeAtPath(data);
        
                if (!data.error_code) {
                    var elem = node.elem;
                    switch (data.cmd) {
                        case "get_value":
                            if (node.attributeName)
                                data.retVal = elem.attr(node.attributeName);
        
                            else if (node.propertyName)
                                data.retVal = elem.prop(node.propertyName);
        
                            else
                                data.retVal = elem.prop('outerHTML');
                            break;
        
                        case "get_cookie":
                            if (data.cookieName) {
                                data.retVal = getCookie(data.cookieName);
                            } else
                                data.retVal = getAllCookies();
                            break;
        
                        case "remove_cookie":
                            deleteCookie(data.cookieName);
                            break;
        
                        case "set_cookie":
                            setCookie(data.cookieName, data.value);
                            break;
        
                        case "get_text":
                            data.retVal = elem.text();
                            break;
        
                        case "count":
                            data.retVal = elem.length;
                            break;
        
                        case "check_exists":
                            data.retVal = true;
                            break;
        
                        case "check_visible":
                            var hidden = elem.is(":hidden") || elem.css("visibility") == "hidden";
                            data.retVal = !hidden;
                            break;
        
                        case "set_value":
                            elem.val(data.value);
                            dispatchKeyUp(elem[0]);
                            break;
        
                        case "click":
                            createMouseEvent(elem, "click");
                            break;
        
                        case "set_var":
                            if (data.value) {
                                var expr = "(function(){" + data.value + "})();";
                                elem = eval(expr);
                            }
        
                            var varId = newGuid();
                            elem.attr('restbot_var', varId);
                            document.restbot_vars.unshift(varId);
                            break;
        
                        case "mouse":
                            data.value.split(',').forEach(function (mouseType) {
                                if (mouseType !== '') {
                                    createMouseEvent(elem, mouseType);
                                }
                            });
                            break;
        
                        case "invoke":
                            var expr = "(function(){" + data.value + "})();";
                            console.log('invoking: ' + expr);
                            data.retVal = eval(expr);
                            break;
        
                        case "inject":
                            var script_node = elem[0].ownerDocument.createElement('script');
                            script_node.type = 'text/javascript';
                            var text_node = elem[0].ownerDocument.createTextNode(data.value)
                            script_node.appendChild(text_node);
                            elem[0].ownerDocument.body.appendChild(script_node);
                            break;
        
                        default:
                            throw new Error("Action not supported: " + data.cmd);
                    }
                }
                */
    }
    catch (err) {
        console.log('500 error: ' + err.message);
        console.log(err);
        data.error_code = 500;
        data.error_message = err.message;
    }
}