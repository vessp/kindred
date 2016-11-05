import React from 'react'
import SoundComponent from '../components/SoundComponent'
const electron = window.require('electron')
const BrowserWindow = electron.BrowserWindow

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        this.props.actions.init()
    }

    render () {
        const {isSocketConnected, actions} = this.props

        return (
            <div>
            <i className={'fa' + (isSocketConnected?'fa-link':'fa-unlink')}></i>
                <SoundComponent/>
            </div>
        )
    }
}

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../redux/actions'
export default connect(
    (state) => {
        //map store to props
        return {
            isSocketConnected: state.app.isSocketConnected
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
