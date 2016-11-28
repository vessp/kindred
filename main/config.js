'use strict'

const electron = require('electron')
const {app} = electron
const settings = require('electron-settings')

module.exports = {
    getConfig(IS_DEV, dirname) {
        let URL_SERVER_ROOT = 'https://kankei.herokuapp.com'
        let URL_AUDIO_ROOT = 'https://kankei.herokuapp.com/audio'
        let URL_WEB_SOCKET = 'wss://kankei.herokuapp.com'

        if(IS_DEV) {
            // let URL_SERVER_ROOT = 'http://localhost:3000'
            // let URL_AUDIO_ROOT = 'http://localhost:3000/audio'
            // let URL_WEB_SOCKET = 'ws://localhost:3000'
        }


        //dirname = 'k:\Ghubs\electron-react-starter\app'
        let dirParts = dirname.split('\\')
        dirParts.pop()
        const PATH_PACKAGE_JSON_FOLDER = dirParts.join('\\')
        //in production PATH_PACKAGE_JSON_FOLDER was K:\Ghubs\kindred\build\Kindred-win32-x64\resources\app which is the same folder as in dev

        dirParts.pop()
        dirParts.pop()
        const PATH_PROD_EXE_FOLDER = dirParts.join('\\')

        const PATH_SETTINGS_FILE = settings.getSettingsFilePath()

        const PATH_USER_DATA = app.getPath('userData') // C:\Users\Vessp\AppData\Roaming\Kindred
        // const PATH_OS_APPDATA = app.getPath('appData') //C:\Users\Vessp\AppData\Roaming


        const config = {
            IS_DEV,
            
            URL_SERVER_ROOT,
            URL_AUDIO_ROOT,

            URL_WEB_SOCKET,

            PATH_PACKAGE_JSON_FOLDER,
            PATH_PROD_EXE_FOLDER,
            PATH_SETTINGS_FILE,
            PATH_USER_DATA
        }

        return config
    }
}