const initialState = {
    myCounter: 0,
    projectDir: __dirname,
    isSocketConnected: false,
    activePlay: ''
}

function appReducer(state = initialState, action) {
    switch (action.type) {
    case 'myCounter':
        return Object.assign({}, state, {
            myCounter: action.payload
        })
    case 'projectDir':
        return Object.assign({}, state, {
            projectDir: action.payload
        })
    case 'isSocketConnected':
        return Object.assign({}, state, {
            isSocketConnected: action.payload
        })
    case 'playlist':
        return Object.assign({}, state, {
            playlist: action.payload
        })
    case 'activePlay':
        return Object.assign({}, state, {
            activePlay: action.payload
        })
    default:
        return state
    }
}

export default appReducer