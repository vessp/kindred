import React from 'react'

import Splash from '../containers/Splash'
import Home from '../containers/Home'
import Overlay from '../containers/Overlay'
import Update from '../containers/Update'
const Sound = require('react-sound')

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        document.getElementsByClassName('navigation')[0].style.display = 'none'
        setTimeout(() => {
            // document.getElementsByClassName('body-content')[0].style.display = 'none'
            document.getElementsByClassName('navigation')[0].style.display = ''
        }, 750)
        
    }

    render () {
        const {actions, isSocketConnected, windowMode, activeBlurb, isCrisp} = this.props

        let page = null
        if(!isCrisp)
            page = <Update/>
        else if(!isSocketConnected)
            page = <Splash/>
        else if(windowMode==1)
            page = <Home/>
        else if(windowMode==2)
            page = <Overlay/>

        return (
            <div className='navigation'>
                {page}

                <Sound
                    url={activeBlurb || ''}
                    playStatus={Sound.status.PLAYING}
                    onLoading={() => {}}
                    onPlaying={() => {}}
                    onFinishedPlaying={() => {this.props.actions.activeBlurb('')}}
                    />
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
            isSocketConnected: state.app.get('isSocketConnected'),
            windowMode: state.app.get('windowMode'),
            activeBlurb: state.app.get('activeBlurb'),
            isCrisp: state.app.get('isCrisp'),
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
