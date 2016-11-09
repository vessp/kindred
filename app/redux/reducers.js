const electron = window.require('electron')
const {ipcRenderer} = electron

const initialState = {
    projectDir: ipcRenderer.sendSync('projectDir'),
    isSocketConnected: false,
    activeBlurb: '',
    windowMode: 1,
    overlayKeyCode: 115
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
            activeBlurb: action.payload
        })
    case 'windowMode':
        return Object.assign({}, state, {
            windowMode: action.payload
        })
    case 'overlayKeyCode':
        return Object.assign({}, state, {
            overlayKeyCode: action.payload
        })
    default:
        return state
    }
}

export default appReducer