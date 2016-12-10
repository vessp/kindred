const fs = window.require('fs')
const request = window.require('request')
const requestProgress = window.require('request-progress')
import {trace, notify} from '../util/Tracer'


function makePath(path) {
    const pathParts = path.split('\\')
    let curPath = pathParts[0]
    pathParts.forEach((dir, i) => {
        if(i>0)
            curPath += '\\' + dir
        if (!fs.existsSync(curPath)) {
            trace('creating dir', curPath)
            fs.mkdirSync(curPath);
        }
    });
}

module.exports = {

    makePath: makePath,

    downloadFile: (url, path, onComplete=null, onProgress=null, onError=null) => {
        //if path is './asdf' it will write the file asdf in the project folder beside package.json
        trace('downloadFile', url, '-->', path)

        const pathParts = path.split('\\')
        pathParts.pop()
        const dirPath = pathParts.join('\\')
        makePath(dirPath)

        if (!fs.existsSync(dirPath)) {
            notify('could not create path to download file')
            return
        }


        return requestProgress(request(url), {
            throttle: 250,                    // Throttle the progress event to 2000ms, defaults to 1000ms 
            delay: 0,                       // Only start to emit after 1000ms delay, defaults to 0ms 
            // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length 
        })
        .on('progress', function (state) {
            // trace('progress', state)
            // The state is an object that looks like this: 
            // { 
            //     percentage: 0.5,           // Overall percentage (between 0 to 1) 
            //     speed: 554732,             // The download speed in bytes/sec 
            //     size: { 
            //         total: 90044871,       // The total payload size in bytes 
            //         transferred: 27610959  // The transferred payload size in bytes 
            //     }, 
            //     time: { 
            //         elapsed: 36.235,      // The total elapsed seconds since the start (3 decimals) 
            //         remaining: 81.403     // The remaining seconds to finish (3 decimals) 
            //     }
            // }
            if(onProgress)
                onProgress(state)
        })
        .on('error', function (err) {
            trace(err)
            alert('error downloading playlist: ' + JSON.stringify(err))
            if(onError)
                onError(err)
        })
        .on('end', function () {
            // Do something after request finishes
            if(onComplete)
                onComplete()
        })
        .pipe(fs.createWriteStream(path))
    }
}