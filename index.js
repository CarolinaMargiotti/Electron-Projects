//npm run dev

const { app, BrowserWindow, Menu, dialog, ipcMain, Accelerator, globalShortcut, shell } = require("electron");
const fs = require('fs');
const path = require('path');

//Main Window
let mainWindow;
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,


        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    await mainWindow.loadURL(`File://${__dirname}/src/pages/editor/index.html`)

    mainWindow.webContents.openDevTools();

    createNewFile();

    ipcMain.on('update-content', function (event, data) {
        file.content = data;
    });
}

function writeFile(filePath) {
    try {
        fs.writeFile(filePath, file.content, function (error) {
            if (error) throw error;

            //saved file sucesfully
            file.path = filePath;
            file.name = path.basename(filePath);
            file.saved = true;

            //rename title to new name of file
            mainWindow.webContents.send('set-file', file)
        })
    } catch (e) {
        console.log(e);
    }
}

async function saveFileAs() {
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    });

    //verify cancellation
    if (dialogFile.canceled) {
        return false;
    }

    writeFile(dialogFile.filePath);
}

function saveFile() {
    if (file.saved) {
        return writeFile(file.path);
    }
    return saveFileAs();
}

var file = {}
function createNewFile() {
    file = {
        name: "New file.txt",
        content: "",
        saved: false,
        path: app.getPath("documents") + "/New file.txt"
    };

    mainWindow.webContents.send("set-file", file);
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.log(e);
        return '';
    }
}

async function openFile() {
    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path
    });

    //verify cancellation
    if (dialogFile.canceled) return false;

    file = {
        name: path.basename(dialogFile.filePaths[0]),
        content: readFile(dialogFile.filePaths[0]),
        saved: true,
        path: dialogFile.filePaths[0]
    }

    mainWindow.webContents.send('set-file', file);
}



//create menu
const templateMenu = [
    {
        label: "File",
        submenu: [
            {
                label: "New",
                click() {
                    createNewFile();
                },
                accelerator: 'Ctrl+N'
            },
            {
                label: "Open",
                click() {
                    openFile();
                },
                accelerator: 'Ctrl+O'
            },
            {
                label: "Save",
                click() {
                    saveFile();
                },
                accelerator: 'Ctrl+S'
            },
            {
                label: "Save as",
                click() {
                    saveFileAs();
                },
                accelerator: 'Ctrl+Shift+S'
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                role: 'undo'
            },
            {
                label: 'Redo',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Copy',
                role: 'copy'
            },
            {
                label: 'Cut',
                role: 'cut'
            },
            {
                label: 'Paste',
                role: 'paste'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Electron',
                click() {
                    shell.openExternal('https://www.electronjs.org/');
                }
            }
        ]
    }
];

//Menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

app.whenReady().then(createWindow);