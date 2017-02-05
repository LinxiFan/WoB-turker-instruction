'use strict';

var templates = [],
    originalQuestion = '',
    websiteURL = '',
    templateText = '',
    NUM_ROW = 10,
    BodyNode = document.getElementsByTagName('body')[0], 
    ArgTableNode,
    PreviewNode,
    ConfirmationNode,
    TableCache = {}; // cache already entered text

/* upload to the backend
    url - link to the webpage.
    question - the question turkers ask
    data - a list of dicts, each dict is key-value pairs that are arguments of the question.
 */
function upload(url, question, data) {
    removeTable();
    removePreview();
    question = JSON.stringify(question);
    data = JSON.stringify(data);
    $.post('/submit', {
        'url': url,
        'question': question,
        'data': data
    }, function(response) {
        console.log('uploaded: ', response);
    })
    console.log(question + data);
    return md5(question + data);
}

/* add instant key change to question template
 */
document.TurkerInput.Question.oninput = parse;

function removeTable() {
    if (ArgTableNode) {
        BodyNode.removeChild(ArgTableNode);
        ArgTableNode = undefined;
    }
}

function removePreview() {
    if (PreviewNode) {
        BodyNode.removeChild(PreviewNode);
        PreviewNode = undefined;
    }
    if (ConfirmationNode) {
        BodyNode.removeChild(ConfirmationNode);
        ConfirmationNode = undefined;
    }
}

function parse() {
    removeTable();
    removePreview();
    websiteURL = document.TurkerInput.Website.value;
    var is_valid = getTemplates(document.TurkerInput.Question);
    console.log(websiteURL);
    console.log(templates);
    if (!is_valid) 
        return false;

    createTableForm();
    return true;
}

function getTemplates(question) {
    var reg = /\(([^)]+)\)/g;
    var qu = originalQuestion = question.value;
    var matches = qu.match(reg);
    if (!matches) {
        // alert('You must have at least one (...) template');
        // question.value = '';
        return false;
    }
    templates = [];
    matches.forEach(
        function (s) { templates.push(s.slice(1, -1)); }
    );
    templateText = qu.replace(reg, '<span class="highlighter">{}</span>');
    return true;
}

function createTableForm() {
    // table for question template instantiation
    ArgTableNode = createNode('form', BodyNode,
                          ['name', 'ArgTable', 
                          'onsubmit', 'submitForm(); return false;']);

    var table = createNode('table', ArgTableNode);
    //table.setAttribute('border', '1');
    var firstrow = createNode('tr', table);
    for (var i = 0; i < templates.length; i++) {
        var entry = createNode('td', firstrow);
        addTextNode(entry, templates[i]);
    }

    for (var r = 0; r < NUM_ROW; r++) {
        var row = createNode('tr', table);
        for (var c = 0; c < templates.length; c++) {
            var entry = createNode('td', row);
            var inputnode = createNode('input', entry,
                                       ['type', 'text', 
                                       'name', 'input-'+r+'-'+c, 
                                       'style', 'width:250px']);
            inputnode.oninput = previewTable;
            if (templates[c] in TableCache)
                inputnode.value = TableCache[templates[c]][r];
        }
    }
    var div = createNode('div', table);
    addNewLine(div);
    //var button = createNode('button', div, ['type', 'button', 'onclick', 'previewTable()']);
    //addTextNode(button, 'Preview completed questions');
    var button2 = createNode('button', div, ['type', 'submit']);
    addTextNode(button2, 'Submit');

    var instruction = createNode('tr', ArgTableNode, ['class', 'example']);
    instruction.innerHTML = 'A live preview will appear below as you fill out the table. The values you\'ve entered will be preserved, so feel free to change the question template if you need to.<br>Please <b>carefully verify</b> the completed questions before you click "submit". You will receive a confirmation code after submission.';
}

function previewTable() {
    removePreview();
    for (var c = 0; c < templates.length; c++)
        TableCache[templates[c]] = [];
    var matrix = [];
    for (var r = 0; r < NUM_ROW; r++) {
        var row = [];
        for (var c = 0; c < templates.length; c++) {
            var val = document.ArgTable['input-'+r+'-'+c].value;
            row.push(val);
            TableCache[templates[c]].push(val);
        }
        matrix.push(row);
    }
    console.log(matrix);
    // display
    /*
    PreviewNode = createNode('ul', BodyNode);
    for (var r = 0; r < NUM_ROW; r++) {
        var entry = createNode('li', PreviewNode);
        entry.innerHTML = strformat(templateText, ...matrix[r]);
        // addTextNode(entry, strformat(templateText, ...matrix[r]));
    }
    */
    PreviewNode = createNode('table', BodyNode, ['class', 'roundrect']);
    var PreviewNode_ = createNode('table', PreviewNode, ['class', 'collapsed']);
    for (var r = -1; r < NUM_ROW; r++) {
        var entry = createNode('tr', PreviewNode_);
        if (r == -1) {
            entry = createNode('td', entry);
            entry.innerHTML = '<h2><b>Preview completed question</b></h2>';
        } else {
            entry = createNode('td', entry, ['class', 'tdborder']);
            entry.innerHTML = strformat(templateText, ...matrix[r]);
        }
    }

    return matrix;
}

function submitForm() {
    var matrix = previewTable();
    var D = []; // list of dicts of blank args
    for (var r = 0; r < matrix.length; r++) {
        var entry = {};
        for (var c = 0; c < templates.length; c++)
            entry[templates[c]] = matrix[r][c];
        D.push(entry);
    }
    var code = upload(websiteURL, originalQuestion, D);
    ConfirmationNode = createNode('p', BodyNode);
    ConfirmationNode.innerHTML = 'Your submission code is <br><span class="highlighter">' + code + '</span><br>Please copy and paste it back to the Amazon Mechanical Turk page. <br>Thanks for your participation! We really appreciate your time.';
}

function createNode(name, ancestor, attrs) {
    var node = document.createElement(name);
    if (attrs)
        for (var i = 0; i < attrs.length; i += 2) {
            node.setAttribute(attrs[i], attrs[i+1]);
        }
    if (ancestor)
        ancestor.appendChild(node);
    return node;
}

function addNewLine(ancestor) {
    var mybr = document.createElement('br');
    ancestor.appendChild(mybr);
    return ancestor;
}

function addTextNode(ancestor, text) {
    ancestor.appendChild(document.createTextNode(text));
    return ancestor;
}

function strformat(s) {
    var i = 1, args = arguments;
    return s.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};
