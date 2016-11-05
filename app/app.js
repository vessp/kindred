//React libraries
import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'

import appReducer from './redux/reducers'

const reducers = combineReducers({
    app:appReducer
})

const store = createStore(reducers, {}, applyMiddleware(
  thunkMiddleware,
  promiseMiddleware()
))

//Import Container component
import Page1 from './containers/page1'
import Home from './containers/Home'

class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <Home />
            </Provider>
        )
    }
}

// Render to index.html
ReactDOM.render(
  <App/>,
  document.getElementById('content')
)