'use strict';

var templates = [];
var templateText = '';
var NUM_ROW = 5;

function validate() {
    var website = document.TurkerInput.Website.value;
    get_templates(document.TurkerInput.Question);
    console.log(website);
    console.log(templates);
    if (!templates)
        return false;

    create_table_form(templates);
    return true;
}

function get_templates(question) {
    var reg = /\(([^)]+)\)/g;
    var matches = question.value.match(reg);
    if (!matches) {
        alert('You must have at least one (...) template');
        question.value = '';
        return false;
    }
    templates = [];
    matches.forEach(
        function (s) { templates.push(s.slice(1, -1)); }
    );

    templateText = question.value.replace(reg, '{}');
}

function create_table_form() {
    // table for question template instantiation
    var form = createNode('form', 
                          document.getElementsByTagName('body')[0], 
                          ['name', 'ArgTable', 
                          'onsubmit', 'print_table(); return false;']);

    var table = createNode('table', form);
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
        }
    }
    var div = createNode('div', table);
    addNewLine(div);
    var button = createNode('button', div, ['type', 'submit']);
    addTextNode(button, 'Submit');
}

function print_table() {
    var matrix = [];
    for (var r = 0; r < NUM_ROW; r++) {
        var row = [];
        for (var c = 0; c < templates.length; c++) {
            row.push(document.ArgTable['input-'+r+'-'+c].value);
        }
        matrix.push(row);
    }
    console.log(matrix);
    // display
    var bulletList = createNode('ul', 
                          document.getElementsByTagName('body')[0]);
    for (var r = 0; r < NUM_ROW; r++) {
        var entry = createNode('li', bulletList);
        addTextNode(entry, strformat(templateText, ...matrix[r]));
    }
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
