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
                <div className="container">
                    <div className="row">
                        {playlist && playlist.map(name => {
                            return (
                                <div key={name} className="col-xs-3 alert alert-info"
                                onClick={() => this.onPlay(name)}>{name}</div>
                            )
                        })}
                    </div>
                </div>
                
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
