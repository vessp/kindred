import React from 'react'
const electron = window.require('electron')
const {dialog} = electron.remote
import axios from 'axios'
const fs = window.require('fs')

class _Component extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    onUpload() {
        let chosenFiles = dialog.showOpenDialog({properties: ['openFile']}) //'openDirectory', 'multiSelections'
        if(chosenFiles) {
            const chosenFilePath = chosenFiles[0]
            const parts = chosenFilePath.split('\\')
            const chosenFileName = parts[parts.length-1]
            fs.open(chosenFilePath, 'r', (err, fd) => {
                if (err) { console.log(err); return }
                fs.readFile(fd, (err, fileBytes) => {
                    if (err) { console.log(err); return }
                    axios.post('http://localhost:3000/audio', {name: chosenFileName, data: fileBytes})
                        .then(function (response) {
                            console.log('response', response)
                        })
                        .catch(function (err) {
                            console.log('err', err)
                        })
                })
            })
        }
    }

    onPlay(name) {
        this.props.actions.play(name)
    }

    render(){
        const {playlist, activePlay} = this.props

        return (
            <div className="playlist">
                <h1>Playlist</h1>
                <button onClick={this.onUpload.bind(this)}>upload</button>
                
                {playlist && playlist.map(name => {
                    return <div key={name} onClick={() => this.onPlay(name)}>{name}</div>
                })}
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
            playlist: state.app.playlist,
        }
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(_Component)
