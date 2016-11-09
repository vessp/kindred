//React libraries
import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'

import appReducer from './redux/reducers'
import Navigation from './containers/Navigation'

const reducers = combineReducers({
    app:appReducer
})

const store = createStore(reducers, {}, applyMiddleware(
  thunkMiddleware,
  promiseMiddleware()
))


class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <Navigation/>
            </Provider>
        )
    }
}

ReactDOM.render(
  <App/>,
  document.getElementsByClassName('body-content')[0]
)