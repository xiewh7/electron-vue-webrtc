// import 'v8-compile-cache'
import { app } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Constants from './utils/Constants'
// import { createErrorWindow, createMainWindow } from './MainRunner'
import { createErrorWindow } from './windows-utls/error'
import { createMainWindow } from './windows-utls/main'
import { macOSDisableDefaultMenuItem } from './utils/Menus'
import handleIpc from './ipc'

let mainWindow
let errorWindow
app.commandLine.appendSwitch('js-flags', '--no-compilation-cache')
app.on('ready', () => {
  if (!Constants.IS_DEV_ENV) {
    global.__static = join(dirname(fileURLToPath(import.meta.url)), '/static').replace(
      /\\/g,
      '\\\\'
    )
  }

  macOSDisableDefaultMenuItem()
  console.error('123456')
  mainWindow = createMainWindow(mainWindow)
  handleIpc()
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(mainWindow)
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    app.quit()
  }
})

app.on('render-process-gone', (ev, webContents, details) => {
  errorWindow = createErrorWindow(errorWindow, mainWindow, details)
})

process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})
