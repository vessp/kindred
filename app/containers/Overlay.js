import React from 'react'
import RadialPlayer from '../components/RadialPlayer'

class _Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
      
        }
    }

    componentDidMount() {
        
    }

    render () {
        const {actions, isOverlay} = this.props

        return (
            <div>
                <RadialPlayer/>
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
            isOverlay: state.app.get('isOverlay')
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
