const fs = window.require('fs')
const request = window.require('request')
const requestProgress = window.require('request-progress')
import {trace} from '../util/Tracer'


module.exports = {
    downloadFile: (url, path) => {
        trace('downloadFile', url, path)

        return requestProgress(request(url))
        // .on('progress', function (state) {
        //     trace(state)
        //     // The state is an object that looks like this: 
        //     // { 
        //     //     percentage: 0.5,           // Overall percentage (between 0 to 1) 
        //     //     speed: 554732,             // The download speed in bytes/sec 
        //     //     size: { 
        //     //         total: 90044871,       // The total payload size in bytes 
        //     //         transferred: 27610959  // The transferred payload size in bytes 
        //     //     }, 
        //     //     time: { 
        //     //         elapsed: 36.235,      // The total elapsed seconds since the start (3 decimals) 
        //     //         remaining: 81.403     // The remaining seconds to finish (3 decimals) 
        //     //     } 
        //     // } 
        //     // console.log('progress', state);
        // })
        .on('error', function (err) {
            trace(err)
            alert('error downloading playlist: ' + JSON.stringify(err))
        })
        .pipe(fs.createWriteStream(path))
    }
}