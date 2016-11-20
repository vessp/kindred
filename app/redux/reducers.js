const electron = window.require('electron')
const {ipcRenderer} = electron
const settings =  window.require('electron-settings')
const Immutable = window.require('immutable')
import {trace} from '../util/Tracer'

const initialState = Immutable.fromJS({
    projectDir: ipcRenderer.sendSync('projectDir'),
    isSocketConnected: false,
    activeBlurb: null,
    windowMode: null,
    overlayKey: null,//115, //don't need this default
    lastActionInstant: Date.now(),
    lastMessageInstant: Date.now(),
    keyMap: null,
    hotkeyWindowTitle: null,
    hitchActive: false,
    hitchName: null
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
        payload.sort((a,b) => a.localeCompare(b))
        return state.merge({
            playlist: payload
        })
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