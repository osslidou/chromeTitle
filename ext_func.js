function getHsTitle(env) {
    var loginName = $('.memberAvatar').next().text();
    return env + ' - ' + loginName;
}

function getHsData() {
    var retval = [];

    var text = 'memberId = ' + getHSValue('memberId') + '\n';
    text += 'memberEmail = ' + getHSValue('memberEmail') + '\n';
    text += 'memberName = ' + getHSValue('memberName') + '\n';
    text += 'memberPlan = ' + getHSValue('memberPlan') + '\n';
    text += 'memberMaxPlanCode = ' + getHSValue('memberMaxPlanCode') + '\n';

    retval[0] = text;

    text = '';

    $('div[mid]').each(function (index) {
        var seqNumber = $(this).find('._sequenceNumber')
        sequenceNumber = '';
        if (seqNumber.length)
            sequenceNumber = seqNumber.attr('value');

        text += $(this).attr('mid') + '[' + sequenceNumber + ']' + ': ' + $(this).text().replace(/\s\s+/g, ' ') + '\n';
    });
    retval[1] = text;

    return retval;
}

function getHSValue(key) {
    var retval = '';
    try {
        var value = document.documentElement.outerHTML;
        var re = new RegExp("hs." + key + "=(.*?);$", "gim");
        var matches = re.exec(value);
        retval = matches[1];
    } catch (error) {
        return "undefined"
    }

    return retval;
}