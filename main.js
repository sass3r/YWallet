const {app, BrowserWindow} = require('electron');
const { spawn } = require('child_process');
const ipc = require('electron').ipcMain;

function createWindow () {
  win = new BrowserWindow({width: 800, height:600});
  win.loadFile('inicio.html');
}

function connectYanaptiChain() {
    const cmd = spawn('bin\\multichaind.exe', ['YanaptiChain -daemon']);
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
    const cmd = spawn('bin\\multichaind.exe', ['YanaptiChain@192.168.1.4:9551']);

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
    const cmd = spawn('bin\\multichain-cli.exe', ['YanaptiChain gettotalbalances']);
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

app.on('ready',createWindow);
ipc.on('connect-yanaptichain',connectYanaptiChain);
ipc.on('register-yanaptichain',registerYanaptiChain);
ipc.on('query-monto', consultarSaldo);
