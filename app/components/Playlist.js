import React from 'react'
const electron = window.require('electron')
const {dialog} = electron.remote

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
        const {playlist, activePlay} = this.props

        return (
            <div className="playlist">
                <ul className="list-group">
                    {playlist && playlist.map(name => {
                        // return <div key={name} onClick={() => this.onPlay(name)}>{name}</div>
                        return <li key={name} onClick={() => this.onPlay(name)} 
                                className="list-group-item">{name.split('.')[0]}</li>
                    })}
                </ul>
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
