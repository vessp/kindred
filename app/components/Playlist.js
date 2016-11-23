import React from 'react'
const electron = window.require('electron')
const {dialog} = electron.remote
const toKeyString = window.require('keycode')
import {trace} from '../util/Tracer'

class _Component extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    onPlay(name) {
        this.props.actions.playLocal(name)
    }

    onRemoveAudio(name) {
        if(window.confirm('Are you sure you want to delete this sound?', 'Kindred Confirmation'))
            this.props.actions.removeAudio(name)
    }
    onSetHotkey(e, clipName) {
        //shift 16
        //ctrl 17
        //alt 18
        if(e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18)
            return

        let modifier = ''
        if(e.ctrlKey) modifier += 'CTRL+'
        if(e.shiftKey) modifier += 'SHIFT+'
        if(e.altKey) modifier += 'ALT+'

        trace('ctrl', e.ctrlKey, e.shiftKey, e.altKey)
        e.target.blur()
        const keyString = modifier + toKeyString(e.keyCode).toUpperCase()
        this.props.actions.setClipKey(clipName, keyString)
    }
    onClearHotkey(clipName) {
        this.props.actions.setClipKey(clipName, null)
    }
    render(){
        const {playlist, activePlay, keyMap} = this.props

        if(!playlist || !keyMap)
            return <i className={'fa fa-circle-o-notch'}/>

        return (
            <div className="playlist">
                <ul className="list-group">
                    {playlist && playlist.map(clip => {
                        const name = clip.get('name')
                        const keyString = keyMap.get(name)
                        const shortName = name.split('.')[0]
                        return (
                            <li key={name} className="list-group-item">
                                <span className='item-key'>
                                    <input type='text' 
                                        onKeyDown={e => this.onSetHotkey(e,name)}
                                        value={keyString}
                                        onChange={() => {}}
                                        />
                                    <i className={'fa fa-remove'}
                                        onClick={e => {
                                            e.stopPropagation()
                                            this.onClearHotkey(name)
                                        }}/>
                                </span>
                                {/*<select>
                                    <option>PASS</option>
                                    <option>block</option>
                                </select>*/}
                                <span className='item-name'
                                    onClick={() => this.onPlay(name)}>
                                    {shortName}
                                    <i className={'fa fa-remove'}
                                        onClick={e => {
                                            e.stopPropagation()
                                            this.onRemoveAudio(name)
                                        }}/>
                                </span>
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
            playlist: state.app.get('playlist'),
            keyMap: state.app.get('keyMap')
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
