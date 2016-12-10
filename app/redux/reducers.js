const electron = window.require('electron')
const {ipcRenderer} = electron
const settings =  window.require('electron-settings')
const Immutable = window.require('immutable')
import {trace} from '../util/Tracer'
import IO from '../util/IO'
const fs = window.require('fs')

const config = ipcRenderer.sendSync('config')

const initialState = Immutable.fromJS({
    userDataDir: ipcRenderer.sendSync('userDataDir'), //C:\Users\Vessp\AppData\Roaming\Electron
    config: ipcRenderer.sendSync('config'),
    isSocketConnected: false,
    activeBlurb: null,
    windowMode: null,
    overlayKey: null,
    lastActionInstant: Date.now(),
    lastMessageInstant: Date.now(),
    keyMap: null,
    hotkeyWindowTitle: null,
    hitchActive: false,
    hitchName: null,
    userCount: null,
    isCrisp: false,
    crispStatus: null,

})

function appReducer(state = initialState, action) {
    const {type, payload} = action
    let newState
    // trace('reducer', type, payload)
    switch (type) {
    case 'isSocketConnected':
        newState = state.merge({
            isSocketConnected: payload
        })
        registerKeyMap(newState)
        return newState
    case 'playlist':
        payload.sort((a,b) => a.name.localeCompare(b.name))
        newState = state.merge({
            playlist: payload
        })
        settings.set('playlist', payload)
        downloadPlaylist(newState)
        return newState
    case 'activeBlurb':
        return state.merge({
            activeBlurb: payload,
            lastActionInstant: Date.now()
        })
    case 'windowMode':
        toMain('windowMode', payload)
        return state.merge({
            windowMode: payload,
            lastActionInstant: Date.now()
        })
    case 'overlayKey':
        settings.set('overlayKey', payload)
        toMain('overlayKey', payload)
        return state.merge({
            overlayKey: payload
        })
    // case 'lastActionInstant':
    //     return Object.assign({}, state, {
    //         lastActionInstant: action.payload
    //     })
    case 'lastMessageInstant':
        return state.merge({
            lastMessageInstant: payload
        })
    case 'keyMap':
        newState = state.merge({
            keyMap: payload
        })
        registerKeyMap(newState)
        return newState
    case 'setClipKey':
        const {clipName, keyString} = payload
        
        if(keyString == null) {
            newState = state.deleteIn(['keyMap', clipName])
        }
        else {
            newState = state.setIn(['keyMap', clipName], keyString)
        }

        const keyMapJs = newState.get('keyMap').toJS()
        settings.set('keyMap', keyMapJs)
        registerKeyMap(newState)
        return newState
    case 'hotkeyWindowTitle':
        settings.set('hotkeyWindowTitle', payload)
        newState = state.merge({
            hotkeyWindowTitle: payload
        })
        registerKeyMap(newState)
        return newState
    case 'hitchActive':
        return state.merge({
            hitchActive: payload
        })
    case 'hitchName':
        settings.set('hitchName', payload)
        return state.merge({
            hitchName: payload
        })
    case 'userCount':
        return state.merge({
            userCount: payload
        })
    case 'isCrisp':
        return state.merge({
            isCrisp: payload
        })
    case 'crispStatus':
        return state.merge({
            crispStatus: payload
        })
    default:
        return state
    }
}

export default appReducer

function registerKeyMap(state) {
    let keyMap =  state.get('keyMap')
    keyMap = keyMap ? keyMap.toJS() : null

    const isSocketConnected = state.get('isSocketConnected')

    toMain('registerKeyMap', {
        keyMap: isSocketConnected ? keyMap : null,
        hotkeyWindowTitle: state.get('hotkeyWindowTitle')
    })
}

function toMain(type, payload) {
    ipcRenderer.send(type, payload)
}

function downloadPlaylist(state) {
    const config = state.get('config')

    const playlistDir = config.get('PATH_USER_DATA') + '\\playlist'
    if (!fs.existsSync(playlistDir))
        fs.mkdirSync(playlistDir)

    const newPlaylist = state.get('playlist')
    settings.get('playlist').then(oldPlaylist => {
        for(let newClip of newPlaylist) {
            const name = newClip.get('name')
            let wasFound = false
            for(let oldClip of oldPlaylist) {
                if(oldClip.name == name &&
                   oldClip.added_at == newClip.get('added_at'))
                {
                    wasFound = true
                    break
                }
            }

            const url = config.get('URL_AUDIO_ROOT') + '/' + name
            const path = playlistDir + '\\' + name
            if(!wasFound || !fs.existsSync(path))
                IO.downloadFile(url, path )
        }
    })
}