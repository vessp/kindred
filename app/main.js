'use strict'
const electron = require('electron')
const {app, globalShortcut, ipcMain, BrowserWindow, Menu, Tray} = electron
const settings = require('electron-settings')
const {spawn, exec} = require('child_process')
const AutoLaunch = require('auto-launch')

const config = require('./config').getConfig(process.env.NODE_ENV == 'development')

let SHOW_DEV_TOOLS = false
let RESET_SETTINGS = false

if(config.IS_DEV) {
    SHOW_DEV_TOOLS = true
    // RESET_SETTINGS = true
}

const DEV_TOOLS_MODE = 'right'
// const DEV_TOOLS_MODE = 'undocked'

//--build structure--
//folder
//--Kindred.exe
//--resources/
//----app/
//------packge.json
//------app/
//------------------



settings.defaults({
    overlayKey: 'F4',
    keyMap: {},
    hotkeyWindowTitle:'World of Warcraft',
    hitchName: 'Wow-64.exe'
})
// console.log(settings.getSettingsFilePath())
settings.applyDefaultsSync()
if(RESET_SETTINGS)
    settings.resetToDefaults()

//Project Dir
//__dirname = 'k:\Ghubs\electron-react-starter\app'
let dirParts = __dirname.split('\\')
dirParts.pop()
const PROJECT_DIR = dirParts.join('\\')
// console.log(PROJECT_DIR)
//in production PROJECT_DIR was K:\Ghubs\kindred\build\Kindred-win32-x64\resources\app which is the same folder as in dev

require('electron-reload')(PROJECT_DIR+'\\bin') //TODO disable for production?

// let dirParts = PROJECT_DIR.split('\\')
// dirParts.pop()
// dirParts.pop()
// const PROD_EXE_FOLDER_PATH = dirParts.join('\\')
// var autoLauncher = new AutoLaunch({
//     name: 'Kindred',
//     path: PROD_EXE_FOLDER_PATH + '\\Kindred.exe'
// })
// autoLauncher.enable()

let mainWindow = null //keep reference to avoid GC
let tray = null
let isAttemptingHotkeySet = false
let kindredKeysProcess = null

const WIN_MAIN_WIDTH = 460 + (SHOW_DEV_TOOLS && DEV_TOOLS_MODE=='right'?500:0)
const WIN_MAIN_HEIGHT = 330

ipcMain.on('projectDir', (event, arg) => {
    event.returnValue = PROJECT_DIR //synchronous return
})

ipcMain.on('userDataDir', (event, arg) => {
    // console.log(app.getPath('userData')) //C:\Users\Vessp\AppData\Roaming\Electron
    // console.log(app.getPath('appData')) //C:\Users\Vessp\AppData\Roaming
    event.returnValue = app.getPath('userData')
})

ipcMain.on('config', (event, arg) => {
    event.returnValue = config
})

ipcMain.on('windowMode', (event, mode) => {
    setWindowMode(mode)
})

ipcMain.on('overlayKey', (event, keyString) => {
    setOverlayKey(keyString)
})

ipcMain.on('trace', (event, items) => {
    console.log(...items)
})

ipcMain.on('registerKeyMap', (event, args) => {
    const {keyMap, hotkeyWindowTitle} = args

    if(kindredKeysProcess) {
        trace('kill KindredKeys?', kindredKeysProcess.kill())
    }
    if(keyMap && Object.keys(keyMap).length > 0) {
        trace('registerKeyMap', hotkeyWindowTitle, keyMap)
        //const exePath = 'K:\\Ghubs\\AutoHotKey\\kankei\\KindredKeys.exe'
        const exePath = PROJECT_DIR+'\\tools\\KindredKeys.exe'
        const keyMapString = JSON.stringify(keyMap).replace(/"/g, '\"') //need 2 slashes in front of double quotess, 1 to escape this JS, 1 to escape cmd
        kindredKeysProcess = spawn(exePath, [config.URL_SERVER_ROOT, keyMapString, hotkeyWindowTitle, false])
    }
})

function createWindow () {
    mainWindow = new BrowserWindow({
        width: WIN_MAIN_WIDTH,
        height: WIN_MAIN_HEIGHT,
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
    //     if(SHOW_DEV_TOOLS)
    //         mainWindow.show()
    // })
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.loadURL('file://' + PROJECT_DIR + '/app/index.html')
    if(SHOW_DEV_TOOLS)
        mainWindow.webContents.openDevTools({mode:DEV_TOOLS_MODE})
}

function setWindowMode(mode) {
    // trace('setWindowMode()', mode)
    //work area does not include taskbar height
    const screenSize = electron.screen.getPrimaryDisplay().workAreaSize
    const SW = screenSize.width
    const SH = screenSize.height
    const PAD = 10

    if(mode == 2) {
        mainWindow.setPosition(0, 0)
        mainWindow.setSize(SW, SH)
    }
    else if(mode == 1) {
        mainWindow.setPosition(SW-PAD-WIN_MAIN_WIDTH, SH-PAD-WIN_MAIN_HEIGHT)
        mainWindow.setSize(WIN_MAIN_WIDTH, WIN_MAIN_HEIGHT)
    }
    
    if(mode == 0) {
        mainWindow.hide()
    } else {
        mainWindow.show()
    }
}

function setOverlayKey(keyString) {
    globalShortcut.unregisterAll()
    if(!keyString) {
        console.log(keyString)
        return
    }

    isAttemptingHotkeySet = true
    const result = globalShortcut.register(keyString, () => {
        toRenderer('onOverlayKey')
    })
    isAttemptingHotkeySet = false
    if (!result) {
        console.log('globalShortcut registration failed', keyString)
        // toRenderer('setHotkeyError', error)
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    createWindow()

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
        toRenderer('onTrayClick')
    })
})

app.on('will-quit', () => {
    trace('willQuit', 'hasChildProcess='+(kindredKeysProcess!=null))
    globalShortcut.unregisterAll()
    if(kindredKeysProcess) {
        trace('kill KindredKeys?', kindredKeysProcess.kill())
    }
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

process.on('uncaughtException', (error) => {
    console.log('uncaughtException', error)
    if(isAttemptingHotkeySet) {
        toRenderer('setHotkeyError', error)
    }
})

function toRenderer(type, payload) {
    if(mainWindow && mainWindow.webContents)
        mainWindow.webContents.send(type, payload)
    else
        trace('toRenderer() failed')
}

function trace(...items) {
    console.log('Main::', ...items)
}