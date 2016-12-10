import React from 'react'
import { Line } from 'rc-progress'


function getColor(value){
    //value from 0 to 1
    var hue=((value)*120).toString(10)
    return ['hsl(',hue,',100%,50%)'].join('')
}

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        
    }

    render () {
        const {actions, crispStatus} = this.props

        let progress, percentage, remaining, speed, size = null
        let message = null
        
        if(crispStatus) {
            let _message = crispStatus.get('message')
            if(_message) {
                message = <h1 className='message'>{_message}</h1>
            }
            else {
                let _rem = parseInt(crispStatus.getIn(['time', 'remaining']))
                let _remaining = !isNaN(_rem) ? _rem + 's remaining' : ''
                let _speed = parseInt(crispStatus.get('speed') / 1024) + ' kb/s'
                let _size = parseInt(crispStatus.getIn(['size', 'transferred']) / 1024 / 1024) + ' / '
                          + parseInt(crispStatus.getIn(['size', 'total']) / 1024 / 1024) + ' MB'
                let _percentage = crispStatus.get('percentage')*100
                let percColor = getColor(crispStatus.get('percentage'))

                percentage = <h1 className='percentage' style={{color: percColor}}>{parseInt(_percentage) + '%'}</h1>
                progress = <Line percent={_percentage} strokeWidth="4" strokeColor={percColor} />
                remaining = <span>{_remaining}</span>
                speed = <span>{_speed}</span>
                size = <span>{_size}</span>
            }
        }

        return (
            <div className='update container-fluid'>
                <i className={'fa ' + 'fa-remove'} onClick={() => actions.windowMode(0)}></i>
                <div className='update-inner'>
                    <h5>Kindred is downloading an update.. Please wait a moment.</h5>
                    <div className='center-stage'>
                        {message}
                        {percentage}
                        {progress}
                        {remaining}
                    </div>
                    {size}
                    {speed}
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
            crispStatus: state.app.get('crispStatus'),
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
