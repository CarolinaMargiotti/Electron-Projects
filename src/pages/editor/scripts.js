const { ipcRenderer } = require('electron');

//elements
const textarea = document.getElementById('text');
const title = document.getElementById('title');

//set file
ipcRenderer.on("set-file", function (event, data) {
    textarea.value = data.content;
    title.innerHTML = data.name + ' | The World Susest Editor';
});

//update textarea
function handleChangeText() {
    ipcRenderer.send('update-content', textarea.value);
}