import React from 'react'
import Playlist from '../components/Playlist'

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        
    }

    render () {
        const {actions, isSocketConnected, isOverlay} = this.props

        return (
            <div className='home'>
                <div className='home-inner'>
                    <i className={'fa ' + (isSocketConnected?'fa-link':'fa-unlink')}></i>
                    <Playlist/>
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
            isOverlay: state.app.isOverlay,
            activeBlurb: state.app.activeBlurb,
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
