import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, shell } from 'electron'
import { join } from 'path'
import { UiohookKey, uIOhook } from 'uiohook-napi'
import icon from '../../resources/icon.png?asset'

const is_mac = process.platform === 'darwin'
if (is_mac) {
  app.dock.hide() // - 1 -
}

const WIDTH = 200
const HEIGHT = 100

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    maxWidth: WIDTH,
    maxHeight: HEIGHT,
    autoHideMenuBar: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    center: true,
    hasShadow: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  mainWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  uIOhook.on('keydown', (e) => {
    const enumKey = Object.values(UiohookKey).indexOf(e.keycode)

    const key = Object.keys(UiohookKey)[enumKey]

    console.log('Tecla :', key)

    mainWindow.webContents.send('keydown', key)
  })

  uIOhook.start()
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
