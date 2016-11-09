import React from 'react'
import Playlist from '../components/Playlist'
var keyString = require('keycode')

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        
    }

    onKeyDown(e) {
        // console.log(e, e.keyCode, keycode(e.keyCode))
        this.props.actions.overlayKeyCode(e.keyCode)
    }

    render () {
        const {actions, isSocketConnected, overlayKeyCode} = this.props

        return (
            <div className='home container-fluid'>
                <i className={'fa ' + 'fa-remove'} onClick={() => this.props.actions.windowMode(0)}></i>
                <div className='home-inner row'>
                    <div className='col-xs-5'>
                        <div>
                            <i className={'fa ' + (isSocketConnected?'fa-link':'fa-unlink')}></i>
                        </div>
                        <hr/>
                        <form>
                            <div className="form-group">
                                <label>Overlay Key</label>
                                <input type="text" className="form-control" onKeyDown={this.onKeyDown.bind(this)}
                                    value={keyString(overlayKeyCode)} onChange={() => {}}/>
                            </div>
                            <div className='btn btn-primary' onClick={() => this.props.actions.onUpload()}>Upload</div>
                        </form>
                        <hr/>
                    </div>
                    <div className='col-xs-7'>
                        <Playlist/>
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
        //map store to props
        return {
            isSocketConnected: state.app.isSocketConnected,
            activeBlurb: state.app.activeBlurb,
            overlayKeyCode: state.app.overlayKeyCode
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
