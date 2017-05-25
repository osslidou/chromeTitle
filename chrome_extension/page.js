if (!document.hasRun) {
    // add listener only once!
    console.log('onMessage listener added');
    chrome.runtime.onMessage.addListener(messageListener);
    document.hasRun = true;

    var divTag = document.createElement('div');
    divTag.className = 'popup';
    divTag.setAttribute('data-popup', 'popup-1');
    document.body.appendChild(divTag);

    var divInnerTag = document.createElement('div');
    divInnerTag.className = 'popup-inner';
    divTag.appendChild(divInnerTag);

    // contains text..
    var divContentsTag = document.createElement('div');
    divInnerTag.appendChild(divContentsTag);

    var aTag = document.createElement('a');
    aTag.className = 'popup-close';
    aTag.id = 'a123456789';
    aTag.href = '#';
    aTag.innerText = 'x'
    divInnerTag.appendChild(aTag);

    $(function () {
        var elem = $('#a123456789');
        console.log('elem:', elem);
        $('#a123456789').on('click', function (e) {
            //alert('clicked!');
            $('[data-popup]').fadeOut(350);
            e.preventDefault();
        });

        console.log('___ popup handlers intialized 2');
    });

    console.log('texarea created!')
} else {
    console.log('__ already ran!');
}

// function that waits for commands from background extension worker
function messageListener(request, sender, sendResponse) {
    console.log('messageListener');

    if (request.isSetChromeTitle) {
        handleOverrideWebTitle(request);

    } else if (request.isRevealMIDs) {
        handleShowMIDs();

    } else {
        console.log('______ showPopup');
        showPopup();
    }
}

function showPopup() {
    //alert('showPopup5');
    var popup = $('[data-popup]');

    var pTag = document.createElement('p');
    pTag.innerText = "Donec in volutpat nisi. In quam lectus, aliquet rhoncus cursus a, congue et arcu. Vestibulum tincidunt neque id nisi pulvinar aliquam. Nulla luctus luctus ipsum at ultricies. Nullam nec velit dui. Nullam sem eros, pulvinar sed pellentesque ac, feugiat et turpis. Donec gravida ipsum cursus massa malesuada tincidunt. Nullam finibus nunc mauris, quis semper neque ultrices in. Ut ac risus eget eros imperdiet posuere nec eu lectus.";
    divContentsTag.appendChild(pTag);

    console.log('___ popup2:', popup);
    popup.fadeIn(350);
}

function handleShowMIDs() {

    setTimeout(function () {
        $('#1234567890poiuy').remove();

        var elemDiv = document.createElement('textarea');
        elemDiv.id = "1234567890poiuy";
        // refresh button        
        elemDiv.style.cssText = 'position:absolute;margin-left:50px;bottom:0;width:100%;height:100px;z-index:1000;';


        var text = ''
        $('div[mid]').each(function (index) {

            console.log($(this));
            var seqNumber = $(this).find('._sequenceNumber')
            sequenceNumber = '';
            if (seqNumber.length)
                sequenceNumber = seqNumber.attr('value');

            text += $(this).attr('mid') + '[' + sequenceNumber + ']' + ': ' + $(this).text().replace(/\s\s+/g, ' ') + '\n';
        });

        elemDiv.innerHTML = text;

        if (text !== '') {
            document.body.appendChild(elemDiv);
        }

    }, 3000);

}

function handleOverrideWebTitle(request) {
    try {
        console.log('incoming command: ' + JSON.stringify(request));

        var fullTitle = '';
        if (request.text)
            fullTitle = request.text;

        else if (request.func)
            fullTitle = eval(request.func);

        if (request.isAppendCurrent) {
            var titleSplit = document.title.split(' • ');
            var originalTitle = titleSplit.length > 1 ? titleSplit[1] : titleSplit[0];
            fullTitle += ' • ' + originalTitle;
        }

        setInterval(function () {
            document.title = fullTitle;
        }, 1000);
    }
    catch (err) {
        console.log('500 error: ' + err.message);
        console.log(err);
        data.error_code = 500;
        data.error_message = err.message;
    }
}