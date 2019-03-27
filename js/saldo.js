const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('notify-monto',(event,monto)=>{
    modificarMonto(monto);
});

$(document).ready(function(){
    setTimeout(function(){
        ipc.send('query-monto');
    },1000);
});

function modificarMonto(monto) {
    console.log('monto: ' + monto);
    let elementMonto = $('monto');
    elementMonto.html(monto);
}
