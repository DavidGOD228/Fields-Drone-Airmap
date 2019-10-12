const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;

var fs = require('fs');
const http = require('http');

function createWindow() {
  fs.appendFile('kek.txt', 'Hello content!', function(err) {
    if (err) throw err;
    console.log('Saved!');
  });
  mainWindow = new BrowserWindow({ 
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    } 
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../public/index.html'),
        protocol: 'file:',
        slashes: true
      })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const downloadUrlToFile = (filename, url) => {
  const file = fs.createWriteStream("FIRST_PHOTO.jpg");
  const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
    response.pipe(file);
  });
}

  // downloadUrlToFile();

global.gbshit_downloadUrlToFile = downloadUrlToFile;

module.exports = {
  downloadUrlToFile: downloadUrlToFile
  // downloadUrlToFile: (filename, url) => {
  //   const file = fs.createWriteStream("file.jpg");
  //   const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
  //     response.pipe(file);
  //   });
  // }
}