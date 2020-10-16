import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import * as path from 'path'
import { format as formatUrl, resolve as resolveUrl } from 'url'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isDebugBuild = process.env.ELECTRON_WEBPACK_IS_DEBUG_BUILD
const baseUrl = isDevelopment ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}` : formatUrl({ pathname: path.join(__dirname, 'index.html'), protocol: 'file', slashes: true })
const windowSharedParam = {
    webPreferences: {nodeIntegration: true},
    center: true,
    minHeight: 900,
    minWidth: 1200,
    height: 900,
    width: 1600,
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let fightBoardWindowList = {}
let appCloseCalled = false

function createMainWindow() {
    const window = new BrowserWindow({
        ...windowSharedParam
    })

    globalShortcut.register('f5', reloadWindow)
    globalShortcut.register('CommandOrControl+R', reloadWindow)

    if (isDevelopment || isDebugBuild)
        window.webContents.openDevTools()
    else
        window.removeMenu()

    window.loadURL(baseUrl)

    window.on('close', e => {
        if (appCloseCalled)
            return

        e.preventDefault()
        window.webContents.send('app-close')
    })

    window.on('closed', () => mainWindow = null)
    window.webContents.on('devtools-opened', () => setFocus(window))

    return window
}

function reloadWindow() {
    const current_window = BrowserWindow.getFocusedWindow()
    if (null !== current_window)
        current_window.reload()
}

function setFocus(window) {
    if (undefined === window)
        return

    window.focus()
    setImmediate(() => { window.focus() })
}

/**
 * IPC EVENTS
 */
// Software
ipcMain.on('closed', () => {
    appCloseCalled = true
    mainWindow = null
    fightBoardWindowList = {}

    if (process.platform !== 'darwin')
        app.quit()
})

ipcMain.on('open-fight-board', (e, vue_router_url, window_id) => {
    const fight_board_window = new BrowserWindow({ ...windowSharedParam, parent: mainWindow, modal: true }) // modal is mandatory, we can't let the user use the mainWindow when he is managing a fight or some data will be lost

    if (isDevelopment || isDebugBuild)
        fight_board_window.webContents.openDevTools()
    else
        fight_board_window.removeMenu()

    fightBoardWindowList[window_id] = fight_board_window

    fight_board_window.on('closed', () => {
        delete fightBoardWindowList[window_id]
        mainWindow.webContents.send('fight-board-closed', window_id)
    })

    fight_board_window.loadURL(resolveUrl(baseUrl, `#${vue_router_url}`))
    mainWindow.webContents.send('fight-board-opened', window_id)
})

ipcMain.on('fight-board-validated', (e, fight, fighter1, fighter2) => mainWindow.webContents.send('fight-board-validated', fight, fighter1, fighter2))
ipcMain.on('fight-board-score-updated', (e, fight, fighter_up, fighter_down, score_number) => mainWindow.webContents.send('fight-board-score-updated', fight, fighter_up, fighter_down, score_number))
ipcMain.on('check-fight-board-already-opened', () => Object.keys(fightBoardWindowList).forEach(board_id => mainWindow.webContents.send('fight-board-opened', board_id)))

// Autoupdate
ipcMain.on('install-update', autoUpdater.quitAndInstall)
ipcMain.on('download-update', autoUpdater.downloadUpdate)

/**
 * APP EVENTS
 */
// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null)
        mainWindow = createMainWindow()
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow({
        ...windowSharedParam
    })
})


/**
* AUTO UPDATE SECTION
*/
autoUpdater.autoDownload = false
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"
autoUpdater.logger.catchErrors()

if (!isDevelopment)
    setTimeout(() => autoUpdater.checkForUpdates(), 5000);

autoUpdater.on('update-available', () => mainWindow.webContents.send('update-available'))
autoUpdater.on('update-downloaded', () => mainWindow.webContents.send('update-downloaded'))