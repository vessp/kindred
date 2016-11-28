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
        const {actions, crispDlProgress} = this.props

        let progress, percentage, remaining, speed, size = null
        if(crispDlProgress) {
            let _rem = parseInt(crispDlProgress.getIn(['time', 'remaining']))
            let _remaining = !isNaN(_rem) ? _rem + 's remaining' : ''
            let _speed = parseInt(crispDlProgress.get('speed') / 1024) + ' kb/s'
            let _size = parseInt(crispDlProgress.getIn(['size', 'transferred']) / 1024 / 1024) + ' / '
                      + parseInt(crispDlProgress.getIn(['size', 'total']) / 1024 / 1024) + ' MB'
            let _percentage = crispDlProgress.get('percentage')*100
            let percColor = getColor(crispDlProgress.get('percentage'))

            percentage = <h1 className='percentage' style={{color: percColor}}>{parseInt(_percentage) + '%'}</h1>
            progress = <Line percent={_percentage} strokeWidth="4" strokeColor={percColor} />
            remaining = <span>{_remaining}</span>
            speed = <span>{_speed}</span>
            size = <span>{_size}</span>
        }

        return (
            <div className='update container-fluid'>
                <i className={'fa ' + 'fa-remove'} onClick={() => actions.windowMode(0)}></i>
                <div className='update-inner'>
                    <h5>Kindred is downloading an update.. Please wait a moment.</h5>
                    <div className='center-stage'>
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
            crispDlProgress: state.app.get('crispDlProgress'),
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
