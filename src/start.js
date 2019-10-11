const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

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

// --- File System functions ---
// const fs = require('fs');
// console.log('FS', fs);

// function CreateFile(dir, composition) {
//   fs.appendFile(dir, composition, function(err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
// }

// function ReedFile(dir) {
//   return fs.readFile(dir, function(err, data) {
//     if (err) throw err;
//     console.log('Readed!');
//     return data;
//   });
// }

// function WriteFile(dir, composition) {
//   fs.writeFile(dir, composition, function(err) {
//     if (err) throw err;
//     console.log('Replaced!');
//   });
// }

// function DeleteFile(dir) {
//   fs.unlink(dir, function(err) {
//     if (err) throw err;
//     console.log('File deleted!');
//   });
// }

module.exports = {
  ReedFile: function(dir) {
    return 'Piskya';
    // return fs.readFile(dir, function(err, data) {
    //   if (err) throw err;
    //   console.log('Readed!');
    //   return data;
    // });
  }
};
