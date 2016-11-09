const electron = window.require('electron')
const {ipcRenderer} = electron
const {dialog} = electron.remote
const fs = window.require('fs')
const axios = window.require('axios')

const URL_WEB_SOCKET = 'wss://kankei.herokuapp.com' //'ws://localhost:3000'
const URL_AUDIO_ROOT = 'https://kankei.herokuapp.com/audio/' //'http://localhost:3000/audio'
let webSocket = null

export function setPlaylist(val) {
    return { type: 'playlist', payload: val }
}

export function play(name) {
    return (dispatch, getState) => {
        webSocket.send(JSON.stringify({
            type: 'play',
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
        ipcRenderer.send('windowMode', mode)
    }
}

export function overlayKeyCode(keyCode) {
    return (dispatch, getState) => {
        ipcRenderer.send('overlayKeyCode', keyCode)
        dispatch({
            type: 'overlayKeyCode',
            payload: keyCode
        })
    }
}

export function onUpload(keyCode) {
    return (dispatch, getState) => {
        doUpload()
    }
}

export function init() {
    return (dispatch, getState) => {
        ipcRenderer.on('windowMode', (event, val) => {
            dispatch({
                type: 'windowMode',
                payload: val
            })
        })
        ipcRenderer.on('doUpload', doUpload)

        webSocket = new WebSocket(URL_WEB_SOCKET)
        webSocket.onopen = (event) => {
            dispatch({type: 'isSocketConnected', payload: true})
        }
        webSocket.onclose = (event) => {
            dispatch({type: 'isSocketConnected', payload: false})
        }
        webSocket.onmessage = (event) => {
            if(event.data) {
                const data = JSON.parse(event.data)
                if(data.type == 'playlist') {
                    dispatch({type: 'playlist', payload: data.message})
                }
                else if(data.type == 'play') {
                    dispatch({type: 'activeBlurb', payload: URL_AUDIO_ROOT + data.message})
                }
            }
        }
        // webSocket.onerror = (event) => {
        //     
        // }
    }
}

function doUpload() {
    let chosenFiles = dialog.showOpenDialog({properties: ['openFile']}) //'openDirectory', 'multiSelections'
    if(chosenFiles) {
        const chosenFilePath = chosenFiles[0]
        const parts = chosenFilePath.split('\\')
        const chosenFileName = parts[parts.length-1]
        fs.open(chosenFilePath, 'r', (err, fd) => {
            if (err) { console.log(err); return }
            fs.readFile(fd, (err, fileBytes) => {
                if (err) { console.log(err); return }
                axios.post(URL_AUDIO_ROOT, {name: chosenFileName, data: fileBytes})
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