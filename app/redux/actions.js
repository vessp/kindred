const electron = window.require('electron')
const {ipcRenderer} = electron

const URL_WEB_SOCKET = 'ws://localhost:3000'
const URL_AUDIO_ROOT = 'http://localhost:3000/audio/'
let webSocket = null

export function setMyCounter(val) {
    return { type: 'myCounter', payload: val }
}

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

export function init() {
    return (dispatch, getState) => {
        ipcRenderer.on('projectDir', (event, val) => {
            dispatch({
                type: 'projectDir',
                payload: val
            })
        })
        ipcRenderer.send('projectDir', 'arg1')

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
                    console.log(data)
                    dispatch({type: 'activePlay', payload: URL_AUDIO_ROOT + data.message})
                }
            }
        }
        // webSocket.onerror = (event) => {
        //     
        // }
    }
}