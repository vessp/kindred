const electron = window.require('electron')
const {ipcRenderer, shell} = electron
const {dialog} = electron.remote
const fs = window.require('fs')
const axios = window.require('axios')
const settings = window.require('electron-settings')
import {trace} from '../util/Tracer'
const {exec} = window.require('child_process')
import config from '../config'

let webSocket = null
let _dispatch = null

function toReducer(type, payload) {
    _dispatch({type, payload})
}
function toMain(type, payload) {
    ipcRenderer.send(type, payload)
}

export function setPlaylist(val) {
    return { type: 'playlist', payload: val }
}

export function playGlobal(name) {
    return (dispatch, getState) => {
        webSocket.send(JSON.stringify({
            type: 'play',
            payload: name
        }))
    }
}

export function playLocal(name) {
    return (dispatch, getState) => {
        dispatch({type: 'activeBlurb', payload: config.URL_AUDIO_ROOT + name})
    }
}

export function removeAudio(name) {
    return (dispatch, getState) => {
        webSocket.send(JSON.stringify({
            type: 'remove',
            payload: name
        }))
    }
}

export function activeBlurb(name) {
    return (dispatch, getState) => {
        dispatch({
            type: 'activeBlurb',
            payload: name
        })
    }
}

export function windowMode(mode) {
    return (dispatch, getState) => {
        toReducer('windowMode', mode)
    }
}

export function overlayKey(keyString) {
    return (dispatch, getState) => {
        toReducer('overlayKey', keyString)
    }
}

export function onUpload(keyCode) {
    return (dispatch, getState) => {
        doUpload(getState)
    }
}

export function setClipKey(clipName, keyString) {
    return (dispatch, getState) => {
        toReducer('setClipKey', {clipName, keyString})
    }
}

export function hotkeyWindowTitle(title) {
    return (dispatch, getState) => {
        toReducer('hotkeyWindowTitle', title)
    }
}

export function hitchName(name) {
    return (dispatch, getState) => {
        toReducer('hitchName', name)
    }
}

export function init() {
    return (dispatch, getState) => {
        _dispatch = dispatch

        toReducer('windowMode', 0)

        settings.get('overlayKey').then(val => {
            toReducer('overlayKey', val)
        })

        settings.get('keyMap').then(val => {
            toReducer('keyMap', val)
        })

        settings.get('hotkeyWindowTitle').then(val => {
            toReducer('hotkeyWindowTitle', val)
        })

        settings.get('hitchName').then(val => {
            toReducer('hitchName', val)
        })

        ipcRenderer.on('windowMode', (event, mode) => {
            toReducer('windowMode', mode)
        })
        ipcRenderer.on('doUpload', () => {
            doUpload(getState)
        })
        ipcRenderer.on('setHotkeyError', error => {
            alert('Setting that hotkey failed, please try a different key. ' + JSON.stringify(error), 'Kindred')
            toReducer('overlayKey', null)
        })
        ipcRenderer.on('onOverlayKey', () => {
            const windowMode = getState().app.get('windowMode')
            toReducer('windowMode', windowMode != 2 ? 2 : 0)
        })
        ipcRenderer.on('onTrayClick', () => {
            const windowMode = getState().app.get('windowMode')
            toReducer('windowMode', windowMode != 1 ? 1 : 0)
        })

        startProcessChecking(dispatch, getState)
    }
}

export function doSocketConnect() {
    return (dispatch, getState) => {
        webSocket = new WebSocket(config.URL_WEB_SOCKET)
        webSocket.onopen = (event) => {
            toReducer('isSocketConnected', true)
            startPings(dispatch, getState)
        }
        webSocket.onclose = (event) => {
            toReducer('isSocketConnected', false)
        }
        webSocket.onmessage = (event) => {
            if(event.data) {
                const data = JSON.parse(event.data)
                if(data.type == 'playlist') {
                    dispatch({type: 'playlist', payload: data.message})
                }
                else if(data.type == 'play') {
                    dispatch({type: 'activeBlurb', payload: config.URL_AUDIO_ROOT + data.message})
                    trace('play: ' + config.URL_AUDIO_ROOT + data.message)
                }
            }
            toReducer('lastMessageInstant', Date.now())
        }
        webSocket.onerror = (event) => {
            alert('Socket Error: ' + JSON.stringify(event))
        }
    }
}

export function doSocketDisconnect() {
    return (dispatch, getState) => {
        webSocket.close()
        webSocket = null
    }
}

let pingTimer = null
function startPings(dispatch, getState) {
    if(pingTimer != null)
        return

    const messagesElapsed = Date.now() - getState().app.get('lastMessageInstant')
    const actionsElapsed = Date.now() - getState().app.get('lastActionInstant')
    const hitchActive = getState().app.get('hitchActive')
    if(messagesElapsed >= 39000) {
        if(actionsElapsed < 5*60*1000 || hitchActive) {
            // trace('do ping')
            webSocket.send(JSON.stringify({
                type: 'ping',
                payload: ''
            }))
            toReducer('lastMessageInstant', Date.now())

            pingTimer = setTimeout(() => {
                pingTimer = null
                startPings(dispatch, getState)
            }, 5000)
        }
        else {
            dispatch(doSocketDisconnect())
        }
    }
    else {
        pingTimer = setTimeout(() => {
            pingTimer = null
            startPings(dispatch, getState)
        }, 5000)
    }
}

function doUpload(getState) {
    let chosenFiles = dialog.showOpenDialog({properties: ['openFile']}) //'openDirectory', 'multiSelections'
    if(chosenFiles) {
        const chosenFilePath = chosenFiles[0]
        const parts = chosenFilePath.split('\\')
        const chosenFileName = parts[parts.length-1]

        console.log(getState().app.playlist, chosenFileName)
        if(getState().app.playlist.indexOf(chosenFileName) != -1)
        {
            alert('That name is already taken.  Please choose a different one.', 'Kindred')
            trace('name already taken')
            return
        }

        fs.open(chosenFilePath, 'r', (err, fd) => {
            if (err) { console.log(err); return }
            fs.readFile(fd, (err, fileBytes) => {
                if (err) { console.log(err); return }
                axios.post(config.URL_AUDIO_ROOT, {name: chosenFileName, data: fileBytes})
                    .then(function (response) {
                        console.log('response', response)
                    })
                    .catch(function (err) {
                        console.log('err', err)
                    })
            })
        })
    }
}

let processCheckingTimer = null
function startProcessChecking(dispatch, getState) {
    if(processCheckingTimer != null)
        return

    const ref = () => {
        processCheckingTimer = setTimeout(() => {
            processCheckingTimer = null
            startProcessChecking(dispatch, getState)
        }, 60*1000)
    }

    const hitchName = getState().app.get('hitchName')
    if(hitchName == null) {
        ref()
        return
    }

    exec('tasklist /fo csv /fi "Imagename eq ' + hitchName + '"', (error, stdout, stderr) => {
        if(error) trace('tasklist error:', error)
        if(stderr) trace('tasklist stderr:', stderr)
        const lines = stdout.replace(/[\"\r]/g, '').split('\n').filter(line => line.length > 0)
        if(lines.length > 1) { //if we found a matching process
            const processName = lines[1].split(',')[0]
            // trace('process found', processName)
            toReducer('hitchActive', true)

            const isSocketConnected = getState().app.get('isSocketConnected')
            if(!isSocketConnected)
                dispatch(doSocketConnect())
        }
        else {
            // trace('no process found')
            toReducer('hitchActive', false)
        }
        ref()
    })

}