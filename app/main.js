'use strict'

const electron = require('electron')
const {app, globalShortcut, ipcMain, BrowserWindow} = electron

//Project Dir
//__dirname = 'k:\Ghubs\electron-react-starter\app'
let dirParts = __dirname.split('\\')
dirParts.pop()
const PROJECT_DIR = dirParts.join('\\')
// console.log(PROJECT_DIR)

require('electron-reload')(PROJECT_DIR+'\\bin')

let mainWindow //keep reference to avoid GC
let isOverlay = false

ipcMain.on('projectDir', (event, arg) => {
    event.returnValue = PROJECT_DIR //synchronous return
})

ipcMain.on('setOverlay', (event, flag) => {
    setOverlay(flag)
})

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 500,
        // maximizeable: false,
        frame: true,
        transparent: true,
        // titleBarStyle: false,
        // resizable: false,
        // skip-taskbar: true,
        // type: 'notification',
        // show: false,
        // darkTheme: true
    })

    // mainWindow.webContents.on('ready-to-show', function () {
    //     mainWindow.show();
    // });
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.loadURL('file://' + PROJECT_DIR + '/app/index.html')
    mainWindow.webContents.openDevTools()
}

function setOverlay(flag) {
    if(isOverlay == flag)
        return

    mainWindow.setAlwaysOnTop(flag)
    mainWindow.setFullScreen(flag)

    if(flag) {

    } else {
        
    }

    isOverlay = flag
    mainWindow.webContents.send('isOverlay', isOverlay)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    createWindow()

    const ret = globalShortcut.register('F4', () => {
        setOverlay(!isOverlay)
    })

    if (!ret) {
        console.log('globalShortcut registration failed')
    }
})

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})