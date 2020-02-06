const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('notify-monto',(event,monto)=>{
    modificarMonto(monto);
});

ipc.on('get-user-saldo',(event,user)=>{
    currentUser = user;
    console.log('user :'+currentUser);
    showTransf(currentUser);
    showWallet(currentUser.wallet);
});

$(document).ready(function(){
    let currentUser = undefined;
    $('#transf').hide();
    setInterval(function(){
        ipc.send('query-monto');
    },1500);
    ipc.send('get-user','get-user-saldo');
});

function modificarMonto(monto) {
    console.log('monto: ' + monto);
    let elementMonto = $('#monto');
    elementMonto.html(monto);
}

function showWallet(wallet) {
    console.log('wallet: ' + wallet);
    let elementWallet = $('#wallet');
    elementWallet.html(wallet);
}

showTransf = (currentUser) => {
    let rol = currentUser.rol;
    if(rol == 2) {
        $('#transf').show();
    }
};