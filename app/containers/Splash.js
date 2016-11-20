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

    render () {
        const {actions, isSocketConnected, hitchName} = this.props

        let contents = <i className={'fa fa-circle-o-notch fa-spin'}/>
        if(hitchName != null) {
            contents = (
                <div className='splash-inner'>
                    <span>Kindred is currently disconnected, it will automatically connect when the following process is started:</span>
                    <input defaultValue={hitchName} onChange={e => actions.hitchName(e.target.value)}/>
                    <br/>
                    <span>--OR--</span>
                    <br/>
                    <button className='btn' onClick={() => actions.doSocketConnect()}>
                        <i className='fa fa-power-off'/> Connect Now
                    </button>
                </div>
            )
        }

        return (
            <div className='splash container-fluid'>
                <i className={'fa ' + 'fa-remove'} onClick={() => actions.windowMode(0)}></i>
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
            hitchName: state.app.get('hitchName')
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
