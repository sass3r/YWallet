const { ipcRenderer } = require('electron');

const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'Una nueva actualizacion esta disponible. Descargando...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Actualizacion descargada. Va ser instalada en el proximo reinicio. Reiniciar ahora?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification () {
    notification.classList.add('hidden');
}

function restartApp () {
    ipcRenderer.send('restart_app');
} 

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.innerText = 'Version ' + arg.version;
});