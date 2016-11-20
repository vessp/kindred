const electron = window.require('electron')
const {ipcRenderer} = electron

export function trace(...items) {

    for(let i=0; i<items.length; i++) {
        if(items[i] && typeof items[i].toJS == 'function')
            items[i] = items[i].toJS()
    }

    ipcRenderer.send('trace', items)
    console.log(...items)
}