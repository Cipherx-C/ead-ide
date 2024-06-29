const codeEditor = document.getElementById('code-editor');
const previewFrame = document.getElementById('preview-frame');

codeEditor.addEventListener('input', () => {
    const code = codeEditor.value;
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(code);
    previewDocument.close();
});
