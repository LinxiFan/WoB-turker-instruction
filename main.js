'use strict';

var templates = [];

function validate() {
    var website = document.TurkerInput.Website.value;
    templates = get_templates(document.TurkerInput.Question);
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
    var results = [];
    matches.forEach(
        function (s) { results.push(s.slice(1, -1)); }
    );
    return results;
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

    for (var r = 0; r < 10; r++) {
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
    for (var r = 0; r < 10; r++) {
        var row = [];
        for (var c = 0; c < templates.length; c++) {
            row.push(document.ArgTable['input-'+r+'-'+c].value);
        }
        matrix.push(row);
    }
    console.log(matrix);
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
