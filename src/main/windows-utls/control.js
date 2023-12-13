import {BrowserWindow} from 'electron'
import path from 'path'
let win
function create() {
    win = new BrowserWindow({
        width: 1000,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    })

    // require('@electron/remote/main').initialize()
    require("@electron/remote/main").enable(win.webContents)

    win.loadFile(path.resolve(__dirname, '../../renderer-control/index.html'))
}

function send(channel, ...args) {
    win.webContents.send(channel, ...args)
}

export default {create, send}
