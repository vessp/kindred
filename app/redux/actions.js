const electron = window.require('electron')
const {ipcRenderer} = electron

const URL_WEB_SOCKET = 'ws://localhost:3000'
const URL_AUDIO_ROOT = 'http://localhost:3000/audio/'
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

export function setOverlay(flag) {
    return (dispatch, getState) => {
        ipcRenderer.send('setOverlay', flag)
    }
}

export function init() {
    return (dispatch, getState) => {
        ipcRenderer.on('isOverlay', (event, val) => {
            dispatch({
                type: 'isOverlay',
                payload: val
            })
        })

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