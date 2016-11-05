const electron = window.require('electron')
const {ipcRenderer} = electron

const initialState = {
    projectDir: ipcRenderer.sendSync('projectDir'),
    isSocketConnected: false,
    activeBlurb: '',
    isOverlay: false
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
    case 'isOverlay':
        return Object.assign({}, state, {
            isOverlay: action.payload
        })
    default:
        return state
    }
}

export default appReducer