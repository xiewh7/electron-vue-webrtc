import {BrowserWindow, app} from 'electron'
import Constants from '../utils/Constants'
// import path from 'path'


let win
let willQuitApp = false
export function createMainWindow (mainWindow) {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    })

    require('@electron/remote/main').initialize()
    require("@electron/remote/main").enable(win.webContents)

    win.on('close', (e) => {
        // if(willQuitApp) {
        //     win = null
        // } else {
        //     e.preventDefault()
        //     win.hide()
        // }
        if (win && !win.isDestroyed()) {
            win.hide()
        }
        win = null
        app.exit()
    })
    if (Constants.IS_DEV_ENV) {
      console.error('loadurl')
      console.error(Constants.IS_DEV_ENV)
      win.loadURL('http://localhost:9081')
    } else {
      console.error('loadurl2')
      win.loadFile(Constants.APP_INDEX_URL_PROD)
    }


    win.webContents.openDevTools()
    mainWindow = win
    return win
}

export function sendMainWindow(channel, ...args) {
    win.webContents.send(channel, ...args)
}

export function show() {
    win.show()
}

export function close() {
    willQuitApp = true
    win.close()
}

// export default {createMainWindow, sendMainWindow, show, close}
