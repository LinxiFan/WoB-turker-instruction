'use strict';

var templates = [],
    originalQuestion = '',
    websiteURL = '',
    templateText = '',
    NUM_ROW = 5,
    BodyNode = document.getElementsByTagName('body')[0], 
    ArgTableNode,
    BulletListNode,
    TableCache = {}; // cache already entered text

/* submit to the backend
    url - link to the webpage.
    question - the question turkers ask
    data - a list of dicts, each dict is key-value pairs that are arguments of the question.
 */
function submit(url, question, data) {
    $.post('/submit', {
        'url': url,
        'question': JSON.stringify(question),
        'data': JSON.stringify(data)
    }, function(response) {
        console.log('submit', response);
    })
}

function parse() {
    if (ArgTableNode) {
        BodyNode.removeChild(ArgTableNode);
        ArgTableNode = undefined;
    }
    if (BulletListNode) {
        BodyNode.removeChild(BulletListNode);
        BulletListNode = undefined;
    }

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
        alert('You must have at least one (...) template');
        question.value = '';
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
            if (templates[c] in TableCache)
                inputnode.value = TableCache[templates[c]][r];
        }
    }
    var div = createNode('div', table);
    addNewLine(div);
    var button = createNode('button', div, ['type', 'button', 'onclick', 'previewTable()']);
    addTextNode(button, 'Preview completed questions');
    var button2 = createNode('button', div, ['type', 'submit']);
    addTextNode(button2, 'Submit');
}

function previewTable() {
    if (BulletListNode) {
        BodyNode.removeChild(BulletListNode);
        BulletListNode = undefined;
    }
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
    BulletListNode = createNode('ul', BodyNode);
    for (var r = 0; r < NUM_ROW; r++) {
        var entry = createNode('li', BulletListNode);
        entry.innerHTML = strformat(templateText, ...matrix[r]);
        // addTextNode(entry, strformat(templateText, ...matrix[r]));
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
    submit(websiteURL, originalQuestion, D);
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
