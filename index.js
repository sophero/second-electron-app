const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow; 

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// each object in the menutemplate array is a top level menu option
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New Todo' },
      {
        label: 'Quit',
        // accelerator: 'Command+Q',
        // accelerator: (() => {
        //   if (process.platform === 'darwin') {
        //     return 'Command+Q'
        //   } else {
        //     return 'Ctrl+Q'
        //   }
        // })(),
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() { app.quit(); }
      }
    ]
  }
]

// first option gets eaten up by Electron option on OSX. However this is not the case for windows users. Here process.platform === 'darwin' for OSX users. Add an empty object (menu option) to the beginning of the menu using menuTemplate.unshift
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}