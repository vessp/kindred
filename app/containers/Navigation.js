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
        const {actions, isOverlay, activeBlurb} = this.props

        return (
            <div>
                {isOverlay ? <Overlay/> : <Home/>}

                <Sound
                    url={activeBlurb}
                    playStatus={Sound.status.PLAYING}
                    onLoading={() => {}}
                    onPlaying={() => {}}
                    onFinishedPlaying={() => {}}
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
            isOverlay: state.app.isOverlay,
            activeBlurb: state.app.activeBlurb
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
