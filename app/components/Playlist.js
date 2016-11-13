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

    onRemove(name) {
        if(window.confirm('Are you sure you want to delete this sound?', 'Kindred Confirmation'))
            this.props.actions.removeAudio(name)
    }

    render(){
        const {playlist, activePlay} = this.props

        return (
            <div className="playlist">
                <ul className="list-group">
                    {playlist && playlist.map(name => {
                        return (
                            <li key={name} className="list-group-item">
                                {/*<input type='text'/>
                                <select>
                                    <option>PASS</option>
                                    <option>block</option>
                                </select>*/}
                                <span onClick={() => this.onPlay(name)}>{name.split('.')[0]}</span>
                                <i className={'fa fa-remove'} onClick={() => this.onRemove(name)}></i>
                            </li>
                        )
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
