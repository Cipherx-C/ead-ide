var editors = {
    html: null,
    css: null,
    js: null
};

var currentTab = 'html';

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.3/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editors.html = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'html',
        automaticLayout: true
    });

    editors.css = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'css',
        automaticLayout: true
    });

    editors.js = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'javascript',
        automaticLayout: true
    });

    switchTab('html');
});

function loadFile(filename) {
    var fileContent = fileSystem[filename] || '';
    var extension = filename.split('.').pop();
    var editor = editors[extension];
    editor.setValue(fileContent);
}

function switchTab(tab) {
    currentTab = tab;
    for (var key in editors) {
        editors[key].getDomNode().style.display = key === tab ? 'block' : 'none';
    }

    document.querySelectorAll('.tab').forEach(function(el) {
        el.classList.remove('active');
    });
    document.querySelector('.tab[onclick="switchTab(\'' + tab + '\')"]').classList.add('active');
}

function runCode() {
    var htmlCode = editors.html.getValue();
    var cssCode = editors.css.getValue();
    var jsCode = editors.js.getValue();

    var resultFrame = document.getElementById('result-frame');
    var resultDocument = resultFrame.contentDocument || resultFrame.contentWindow.document;
    resultDocument.open();
    resultDocument.write(`
        <style>${cssCode}</style>
        ${htmlCode}
        <script>${jsCode}<\/script>
    `);
    resultDocument.close();

    // Executar testes
    runTests(htmlCode, cssCode, jsCode);
}

function runTests(html, css, js) {
    var testResults = document.getElementById('test-list');
    testResults.innerHTML = '';

    var tests = [
        {
            description: 'HTML contém <div class="container">',
            passed: html.includes('<div class="container">')
        },
        {
            description: 'CSS define fundo do corpo como azul claro',
            passed: css.includes('body { background-color: lightblue; }')
        },
        {
            description: 'JavaScript adiciona ouvinte de eventos a um botão',
            passed: js.includes('addEventListener("click", function() { alert("Botão clicado!"); })')
        }
    ];

    tests.forEach(function(test) {
        var li = document.createElement('li');
        li.textContent = test.description + ': ' + (test.passed ? 'Passou' : 'Falhou');
        li.style.color = test.passed ? 'green' : 'red';
        testResults.appendChild(li);
    });
}

function initFileExplorer() {
    var fileExplorer = document.getElementById('file-explorer');
    var folders = fileExplorer.getElementsByClassName('folder');
    var i;

    for (i = 0; i < folders.length; i++) {
        folders[i].addEventListener('click', function() {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    }

    var files = fileExplorer.getElementsByClassName('file');
    for (i = 0; i < files.length; i++) {
        files[i].addEventListener('click', function() {
            var selectedFile = fileExplorer.querySelector('.file.selected');
            if (selectedFile) {
                selectedFile.classList.remove('selected');
            }
            this.classList.add('selected');
            loadFile(this.textContent);
        });
    }
}

var fileSystem = {
    'index.html': '<!DOCTYPE html><html><head><title>Exemplo</title></head><body><h1>Olá, mundo!</h1><p>Este é um parágrafo de exemplo.</p><button>Botão de Teste</button><div class="container"><p>Dentro de um container estilizado.</p></div></body></html>',
    'style.css': 'body { background-color: lightblue; } h1 { color: navy; } .container { background-color: white; border: 1px solid black; padding: 10px; }',
    'script.js': 'document.querySelector("button").addEventListener("click", function() { alert("Botão clicado!"); });'
};

initFileExplorer();