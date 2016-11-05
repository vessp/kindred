'use strict'

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

//Project Dir
//__dirname = 'k:\Ghubs\electron-react-starter\app'
let dirParts = __dirname.split('\\')
dirParts.pop()
const projectDir = dirParts.join('\\')
// console.log(projectDir)

require('electron-reload')(projectDir+'\\bin')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let overlayWindow

//console.log(app.getPath('userData')) //C:\Users\Vessp\AppData\Roaming\Electron

ipcMain.on('projectDir', (event, arg) => {
    event.sender.send('projectDir', projectDir)
})

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg)  // prints "ping"
//     event.returnValue = 'pong'
// })

function createWindow () {
    //Browser window options
    const browserOptions = {
        width: 1000,
        height: 500,
        maximizeable: false,
        icon:'app/assets/logo.png'
    }
    // Create the browser window.
    mainWindow = new BrowserWindow(browserOptions)

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    overlayWindow = new BrowserWindow({
        width: 500,
        height: 500,
        maximizeable: false,
        frame: false,
        transparent: true
    })
    overlayWindow.loadURL('file://' + __dirname + '/index.html')
    // overlayWindow.webContents.openDevTools()
    overlayWindow.on('closed', () => {
        overlayWindow = null
    })

    
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})