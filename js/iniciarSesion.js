const electron = require('electron');
const ipc = electron.ipcRenderer;

$(document).ready(function(){
    let botonIniciarSesion = $('#botonLogin');

    botonIniciarSesion.click(function(){
        enviarFormulario();
    });
});

function enviarFormulario() {
    if(validarFormulario()) {
        console.log('formulario valido');
        iniciarSesion();
    }else{
        console.log('formulario invalido');
    }
}

function iniciarSesion(){
    let xmlHttpRequest = new XMLHttpRequest();
    let url = "http://178.128.228.106:8086/login";
    let response = undefined;
    let wallet = $('#formWallet').val();
    let password = $('#formPassword').val();
    let object = {
        'wallet': wallet,
        'password': password,
    };
    let json = JSON.stringify(object);
    xmlHttpRequest.open("POST",url,true);
    xmlHttpRequest.setRequestHeader('Content-Type','application/json');
    xmlHttpRequest.onreadystatechange = ( respuesta ) => {
        if(xmlHttpRequest.readyState == 4) {
            if(xmlHttpRequest.status == 200){
                response = respuesta.target.response;
                ipc.send('connect-yanaptichain');
                ipc.send('view-saldo');
                ipc.send('notify-user',response);
                console.log(response);
            }
            if(xmlHttpRequest.status == 401) {
                alert("Wallet ID/Password Incorrecto");
            }
        }
    };
    xmlHttpRequest.send(json);
}

function validarFormulario() {
    let res = true;
    let entradaWallet = $("#formWallet");
    let wallet = entradaWallet.val();
    let entradaContraseña = $("#formPassword");
    let contraseña = entradaContraseña.val();
    let validarWallet = new RegExp('([a-zA-Z0-9]{38,})');
    let validarPasswd = new RegExp("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,16}$");
    let validacionWallet = validarWallet.test(wallet);
    let validacionContraseña = validarPasswd.test(contraseña);

    if(validacionWallet){
        res = res && true;
    }else{
        res = res && false;
        entradaWallet.attr("class","form-control is-invalid");
    }

    if(validacionContraseña){
        res = res && true;
    }else{
        res = res && false;
        entradaContraseña.attr("class","form-control is-invalid");
    }
    return res;
}

function correccionWallet(){
    let entradaWallet = $("#formWallet");
    entradaWallet.attr("class","form-control");
}

function correccionContraseña(){
    let entradaContraseña = $("#formPassword");
    entradaContraseña.attr("class","form-control");
}