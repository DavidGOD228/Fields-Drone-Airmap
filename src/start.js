const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

// const resemblejs = require("resemblejs");
// console.log("resemblejs :", resemblejs);

let mainWindow;

var fs = require("fs");
const http = require("http");

function createWindow() {
  console.log("sldkjf");
  fs.appendFile("kek.txt", "Hello content!", function(err) {
    if (err) throw err;
    console.log("Saved!");
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
        pathname: path.join(__dirname, "/../public/index.html"),
        protocol: "file:",
        slashes: true
      })
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// module.exports = {
//   resemble: resemblejs
// };
