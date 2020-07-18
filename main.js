const electron =  require('electron');
const url = require('url');
const path = require('path');
const { Menu, ipcMain } = require('electron');
const dbAccess = require('./database/dbAccess');

const {app, BrowserWindow} = electron;


let mainWindow;
let addWindow;

//listen for app to be ready
app.on('ready', function(){
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.webContents.openDevTools();

    //load html to the window
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, './src/component/mainWindow.html'),
        protocol : 'file',
        slashes : true
    }));

    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width : 500,
        height : 400,
        title : 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    addWindow.webContents.openDevTools()

    //Load html into window
    addWindow.loadURL(url.format({
        pathname : path.join(__dirname, './src/component/addWindow.html'),
        protocol : 'file',
        slashes : true
    }));

    // hide menu
addWindow.setMenu(null);

    //garbage collector
    addWindow.on('closed', function(){
        addWindow = null;
    })
}

// catch item: add
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

const mainMenuTemplate = [
    {
        label : 'File',
        submenu:[
            {
                label : 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label : 'Clear Item',
                click(){
                    dbAccess.testConnection();
                }
            },
            {
                label : 'Quit',
                accelerator : process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}