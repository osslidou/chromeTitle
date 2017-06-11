function getHsTitle(env) {
    var loginName = getHSValue('memberEmail').replace(/'/g, "");
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

function getGoogleData(){
    var retval = [];
    retval[0] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    retval[1] = retval[0]
    retval[2] = retval[0]
    retval[3] = retval[0]
    retval[4] = retval[0]
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