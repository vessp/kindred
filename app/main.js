'use strict'

const electron = require('electron')
const {app, globalShortcut, ipcMain, BrowserWindow, Menu, Tray} = electron
const settings = require('electron-settings')
var keyString = require('keycode')
// settings.defaults({
//   foo: 'bar'
// })

//Project Dir
//__dirname = 'k:\Ghubs\electron-react-starter\app'
let dirParts = __dirname.split('\\')
dirParts.pop()
const PROJECT_DIR = dirParts.join('\\')
// console.log(PROJECT_DIR)

require('electron-reload')(PROJECT_DIR+'\\bin')

let mainWindow = null //keep reference to avoid GC
let windowMode = 0
let tray = null

ipcMain.on('projectDir', (event, arg) => {
    event.returnValue = PROJECT_DIR //synchronous return
})

ipcMain.on('windowMode', (event, mode) => {
    setWindowMode(mode)
})

ipcMain.on('overlayKeyCode', (event, keyCode) => {
    setOverlayKey(keyCode)
})

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 280,
        // useContentSize: true,
        // maximizeable: false,
        moveable: false,
        resizable: false,

        frame: false,
        transparent: true,
        // toolbar: false,
        skipTaskbar: true,
        // titleBarStyle: false,

        // skip-taskbar: true,
        // darkTheme: true,

        show: false,
    })

    // mainWindow.webContents.on('ready-to-show', function () {
    //     mainWindow.show();
    // });
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.loadURL('file://' + PROJECT_DIR + '/app/index.html')
    // mainWindow.webContents.openDevTools()
}

function setWindowMode(mode) {
    if(windowMode == mode)
        return
    // console.log(mode)

    //mainWindow.setAlwaysOnTop(mode == 2)
    //mainWindow.setFullScreen(mode == 2)
    if(mode == 2) {
        mainWindow.setPosition(0, 0)
        mainWindow.setSize(1920, 1080)
    }
    else if(mode == 1) {
        mainWindow.setPosition(1920-10-300, 1080-40-10-280)
        mainWindow.setSize(300, 280)
    }
    

    if(mode == 0) {
        mainWindow.hide()
    } else {
        mainWindow.show()
    }

    windowMode = mode
    mainWindow.webContents.send('windowMode', mode)
}

function setOverlayKey(keyCode) {
    globalShortcut.unregisterAll()
    console.log(keyString(keyCode))
    const result = globalShortcut.register(keyString(keyCode), () => {
        setWindowMode(windowMode != 2 ? 2 : 0)
    })
    if (!result)
        console.log('globalShortcut registration failed')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    createWindow()

    const ret = globalShortcut.register('f4', () => {
        setWindowMode(windowMode != 2 ? 2 : 0)
    })
    if (!ret) {
        console.log('globalShortcut registration failed')
    }

    tray = new Tray(PROJECT_DIR + '/app/assets/split.png')
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Upload', click: () => {
            mainWindow.webContents.send('doUpload')
        }},
        {label: 'Exit', click: () => {
            app.quit()
        }}
    ])
    tray.setToolTip('Kindred')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        setWindowMode(windowMode != 1 ? 1 : 0)
    })
})

app.on('will-quit', () => {
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