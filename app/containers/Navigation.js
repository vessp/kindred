import React from 'react'

import Splash from '../containers/Splash'
import Home from '../containers/Home'
import Overlay from '../containers/Overlay'
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
        const {actions, isSocketConnected, windowMode, activeBlurb} = this.props

        return (
            <div className='navigation'>
                {!isSocketConnected ? (
                    <Splash/>
                ) : (
                    windowMode==1 && <Home/>
                    ||
                    windowMode==2 && <Overlay/>
                )}
                

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
            activeBlurb: state.app.get('activeBlurb')
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
