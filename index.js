const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow, addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  // addWindow.on('closed', () => addWindow = null); // clear memory held by addWindow var so that js can run its garbage collection
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

// each object in the menutemplate array is a top level menu option
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() { createAddWindow(); }
      },
      {
        label: 'Clear Todos',
        click() { mainWindow.webContents.send('todo:clear'); }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() { app.quit(); }
      }
    ]
  }
]

// first menu option gets eaten up by the title Electron option on OSX. However this is not the case for windows users. On OSX process.platform === 'darwin'. Add an empty object (menu option) to the beginning of the menuTemplate array using Array.unshift() to account for this
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' }, // electron preset option.
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}