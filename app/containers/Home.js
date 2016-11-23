import React from 'react'
import Playlist from '../components/Playlist'
var toKeyString = require('keycode')

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        
    }

    onOverlayKey(e) {
        this.props.actions.overlayKey(toKeyString(e.keyCode).toUpperCase())
    }

    onHotkeyWindowTitle(e) {
        const value = e.target.value
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(() => {
            this.props.actions.hotkeyWindowTitle(value)
        }, 1000)
    }

    render () {
        const {actions, isSocketConnected, overlayKey, hotkeyWindowTitle, userCount} = this.props

        let contents = <i className={'fa fa-circle-o-notch fa-spin'}/>
        if(hotkeyWindowTitle != null) {
            contents = (
                <div className='home-inner row'>
                    <div className='col-xs-5'>
                        <div className='icon-bar'>
                            <span>
                                <i className={'fa fa-power-off onClick'}
                                    onClick={() => actions.doSocketDisconnect()}
                                    title='Disconnect'/>
                                <i className={'fa fa-folder-open-o onClick'}
                                    onClick={() => actions.openPlaylistFolder()}
                                    title='Open playlist folder'/>
                            </span>
                            <span>
                                <i className={'fa ' + (isSocketConnected?'fa-link':'fa-unlink')}
                                    title={isSocketConnected?'Connected to Server':'Disconnected from Server'}/>
                                <i className={'fa fa-user'} title='Number of connected users'>{' ' + userCount}</i>
                            </span>
                        </div>
                        <hr/>
                        <form>
                            <div className="form-group">
                                <label>Overlay Key</label>
                                <input type="text" className="form-control" onKeyDown={this.onOverlayKey.bind(this)}
                                    value={overlayKey} onChange={() => {}}/>
                            </div>
                            <div className="form-group">
                                <label>Hotkey Window Title</label>
                                <input type="text" className="form-control"
                                    defaultValue={hotkeyWindowTitle}
                                    onChange={e => this.onHotkeyWindowTitle(e)}/>
                            </div>
                            <div className='btn btn-primary' onClick={actions.onUpload}>Upload</div>
                        </form>
                        <hr/>
                    </div>
                    <div className='col-xs-7'>
                        <Playlist/>
                    </div>
                </div>
            )
        }

        return (
            <div className='home container-fluid'>
                <i className={'fa ' + 'fa-remove'} onClick={() => actions.windowMode(0)}/>
                {contents}
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
            isSocketConnected: state.app.get('isSocketConnected'),
            activeBlurb: state.app.get('activeBlurb'),
            overlayKey: state.app.get('overlayKey'),
            hotkeyWindowTitle: state.app.get('hotkeyWindowTitle'),
            userCount: state.app.get('userCount'),
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
