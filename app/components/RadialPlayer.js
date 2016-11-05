import React from 'react'

class _Component extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    onPlay(name) {
        this.props.actions.play(name)
    }

    render(){
        const {playlist} = this.props

        return (
            <div className="radial-player">
                <h1>Radial</h1>
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
            playlist: state.app.playlist,
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
