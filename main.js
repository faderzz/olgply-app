// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const DiscordRPC = require('discord-rpc');
const clientId = '730577377066877020';
const scopes = ['rpc', 'rpc.api', 'messages.read'];

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadURL('https://olgply.com/')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
  const title = BrowserWindow.getFocusedWindow().getTitle();
  
  rpc.setActivity({
    details: "ogply.com",
    state: `${title}`,
    startTimestamp,
    largeImageKey: 'logo',
    largeImageText: 'olgply.com - ad free streaming',
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
