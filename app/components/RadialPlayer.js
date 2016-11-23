import React from 'react'

class _Component extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    onPlay(name) {
        // console.log('name', name)
        this.props.actions.playGlobal(name)
        this.props.actions.windowMode(0)
    }

    render(){
        const {playlist} = this.props

        return (
            <div className="radial-player">
                <div className="container">
                    <div className="row">
                        {playlist && playlist.map(clip => {
                            const name = clip.get('name')
                            return (
                                <div key={name} className="player-item col-xs-2"
                                onClick={() => this.onPlay(name)}>{name.split('.')[0]}</div>
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
            playlist: state.app.get('playlist'),
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
