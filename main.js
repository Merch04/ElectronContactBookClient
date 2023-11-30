const { app, BrowserWindow, net } = require('electron')



function createWindow () {
  const win = new BrowserWindow({
    
    width: 1040,
    height: 800,
    webPreferences: {
      enableRemoteModule: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    autoHideMenuBar: true,
    devTools: !app.isPackaged,
  })
  
  
  win.loadFile('frontend/pages/mainPage.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
    
    
  })
  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})