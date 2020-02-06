const {app, BrowserWindow} = require('electron');
const { spawn } = require('child_process');
const { autoUpdater } = require("electron-updater");
const ipc = require('electron').ipcMain;
let authUser = undefined;
let win;

function createWindow () {
  win = new BrowserWindow({
      width: 800, 
      height:600,
      webPreferences: {
          nodeIntegration: true,
      }
    });
  win.loadFile('inicio.html');
  win.on('closed', function () {
      win = null;
  });
  autoUpdater.checkForUpdatesAndNotify();
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

function closeWindow () {
    if(process.platform !== 'darwin') {
        app.quit();
    }
}

function activateWindow () {
    if (win === null) {
        createWindow();
    }
}

function connectYanaptiChain() {
    const cmd = spawn('resources\\app\\bin\\multichaind.exe', ['YanaptiChain','-daemon']);
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

}

function registerYanaptiChain() {
    const cmd = spawn('resources\\app\\bin\\multichaind.exe', ['YanaptiChain@178.128.228.106:6801']);

    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        let buffer = data.toString();
        let regexWallet = /([a-zA-Z0-9]{38,})/g;
        if(regexWallet.test(buffer)){
          let walletId = buffer.match(regexWallet)[0]
          console.log(walletId);
          win.webContents.send('notify-walletid',walletId);
        }
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function consultarSaldo(){
    const cmd = spawn('resources\\app\\bin\\multichain-cli.exe', ['YanaptiChain', 'gettotalbalances']);
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        let buffer = data.toString();
        json = JSON.parse(buffer);
        let balance = json[0];
        let saldo = 0;
        if(balance)
            saldo = balance.qty;
        console.log('saldo: ' + saldo);
        win.webContents.send('notify-monto',saldo);
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function mostrarSaldo(){
    win.loadFile('saldo.html');
}

verificarEmail = () => {
    if(!authUser.isConfirmed){
        win.loadFile('verificarEmail.html');
    }
}

verificarPassword = () => {
    if(authUser.isPasswordChanged){
        win.loadFile('cambiarPassword.html');
    }
}

app.on('ready',createWindow);
app.on('window-all-closed',closeWindow);
app.on('activate',activateWindow);
ipc.on('connect-yanaptichain',connectYanaptiChain);
ipc.on('register-yanaptichain',registerYanaptiChain);
ipc.on('query-monto', consultarSaldo);
ipc.on('view-saldo', mostrarSaldo);
ipc.on('notify-user', (event, user) => {
    json = JSON.parse(user);
    authUser = json.user;
    console.log('user: ' + authUser);
    verificarEmail();
    verificarPassword();
});

ipc.on('get-user',(event,action)=>{
    win.webContents.send(action,authUser);
});

ipc.on('transfer-asset',(event,data) => {
//let object = JSON.parse(data);
    const cmd = spawn('resources\\app\\bin\\multichain-cli.exe', ['YanaptiChain','sendassettoaddress',data.cuenta,'YanaptiCoin',data.monto]);
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    //win.loadFile('saldo.html');
});

ipc.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });

});

ipc.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
});

