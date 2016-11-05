import React from 'react'
const electron = window.require('electron')
var Sound = require('react-sound')
const {dialog} = electron.remote
import axios from 'axios'
const fs = window.require('fs')

class IOComponent extends React.Component {
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
        const {projectDir, playlist, activePlay} = this.props
        console.log(activePlay)

        return (
            <div className="alert alert-info">
                <h1>Sound Component</h1>
                <button onClick={this.onUpload.bind(this)}>upload</button>
                <Sound
                    url={activePlay}
                    playStatus={Sound.status.PLAYING}
                    onLoading={() => {}}
                    onPlaying={() => {}}
                    onFinishedPlaying={() => {}}
                    />
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
        //map store to props
        return {
            projectDir: state.app.projectDir,
            playlist: state.app.playlist,
            activePlay: state.app.activePlay
        }
    },
    (dispatch) => {
        //map dispatch to props
        return {
            actions: bindActionCreators(actions, dispatch)
        }
    }
)(IOComponent)
