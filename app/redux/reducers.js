const electron = window.require('electron')
const {ipcRenderer} = electron
const settings =  window.require('electron-settings')

const initialState = {
    projectDir: ipcRenderer.sendSync('projectDir'),
    isSocketConnected: false,
    activeBlurb: '',
    windowMode: 1,
    overlayKeyCode: -1,//115, //don't need this default
    lastActionInstant: Date.now(),
    lastMessageInstant: Date.now()
}

function appReducer(state = initialState, action) {
    switch (action.type) {
    case 'isSocketConnected':
        return Object.assign({}, state, {
            isSocketConnected: action.payload
        })
    case 'playlist':
        return Object.assign({}, state, {
            playlist: action.payload
        })
    case 'activeBlurb':
        return Object.assign({}, state, {
            activeBlurb: action.payload,
            lastActionInstant: Date.now()
        })
    case 'windowMode':
        return Object.assign({}, state, {
            windowMode: action.payload,
            lastActionInstant: Date.now()
        })
    case 'overlayKeyCode':
        settings.set('overlayKeyCode', action.payload)
        return Object.assign({}, state, {
            overlayKeyCode: action.payload
        })
    // case 'lastActionInstant':
    //     return Object.assign({}, state, {
    //         lastActionInstant: action.payload
    //     })
    case 'lastMessageInstant':
        return Object.assign({}, state, {
            lastMessageInstant: action.payload
        })
    default:
        return state
    }
}

export default appReducer