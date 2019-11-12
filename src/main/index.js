import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isDebugBuild = process.env.ELECTRON_WEBPACK_IS_DEBUG_BUILD
const appUpdateUrl = process.env.ELECTRON_WEBPACK_APP_UPDATE_URL // ONLY IN DEBUG BUILD
const appUpdateToken = process.env.ELECTRON_WEBPACK_APP_UPDATE_TOKEN // PRODUCTION TOKEN

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let appCloseCalled = false

function createMainWindow() {
    const window = new BrowserWindow({
        webPreferences: {nodeIntegration: true},
        minHeight: 800,
        minWidth: 1200,
        height: 800,
        width: 1600,
        // useContentSize: true
    })

	globalShortcut.register('f5', reloadWindow)
	globalShortcut.register('CommandOrControl+R', reloadWindow)

    if (isDevelopment || isDebugBuild)
        window.webContents.openDevTools()

    if (isDevelopment)
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    else
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }))

    window.on('close', e => {
        if (appCloseCalled)
            return

        e.preventDefault()
        window.webContents.send('app-close')
    })

    window.on('closed', () => {
        mainWindow = null
    })

    window.webContents.on('devtools-opened', () => {
        window.focus()
        setImmediate(() => {
            window.focus()
        })
    })

    if (undefined !== appUpdateUrl || undefined !== appUpdateToken)
        autoUpdater.checkForUpdates()
    else
        log.warn("App update URL or TOKEN is missing... impossible to check for updates")

    return window
}

function reloadWindow(window) {
    window = window || mainWindow

    if (null === window)
        return

    window.reload()
}

/**
 * IPC EVENTS
 */
ipcMain.on('closed', () => {
    appCloseCalled = true
    mainWindow = null
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
ipcMain.on('install-update', autoUpdater.quitAndInstall)

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
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow()
})

/**
 * AUTO UPDATE SECTION
 */
autoUpdater.autoDownload = true
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"
autoUpdater.logger.catchErrors()

if (isDebugBuild)
    autoUpdater.setFeedURL({ provider: "generic", url: appUpdateUrl })
else
    autoUpdater.requestHeaders = { "PRIVATE-TOKEN": appUpdateToken }

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded')
})