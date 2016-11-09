import React from 'react'

import Home from '../containers/Home'
import Overlay from '../containers/Overlay'
const Sound = require('react-sound')

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
        const {actions, windowMode, activeBlurb} = this.props

        return (
            <div>
                {windowMode==1 && <Home/>}
                {windowMode==2 && <Overlay/>}

                <Sound
                    url={activeBlurb}
                    playStatus={Sound.status.PLAYING}
                    onLoading={() => {}}
                    onPlaying={() => {}}
                    onFinishedPlaying={() => {this.props.actions.activeBlurb('')}}
                    />
            </div>
        )
    }
}

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../redux/actions'
export default connect(
    (state) => {
        return {
            windowMode: state.app.windowMode,
            activeBlurb: state.app.activeBlurb
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
