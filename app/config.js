module.exports = {
    getConfig(IS_DEV) {
        let URL_SERVER_ROOT = 'https://kankei.herokuapp.com'
        let URL_AUDIO_ROOT = 'https://kankei.herokuapp.com/audio'
        let URL_WEB_SOCKET = 'wss://kankei.herokuapp.com'

        if(IS_DEV) {
            // let URL_SERVER_ROOT = 'http://localhost:3000'
            // let URL_AUDIO_ROOT = 'http://localhost:3000/audio'
            // let URL_WEB_SOCKET = 'ws://localhost:3000'
        }

        const config = {
            IS_DEV,
            
            URL_SERVER_ROOT,
            URL_AUDIO_ROOT,

            URL_WEB_SOCKET,
        }

        return config
    }
}