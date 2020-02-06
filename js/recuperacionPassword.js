const electron = require('electron');
const ipc = electron.ipcRenderer;


$(document).ready(function(){
    let botonEnvio = $('#botonEnvio');

    botonEnvio.click(function(){
        enviarFormulario();
    });

    // Toggle the side navigation
    $("#sidenavToggler").click(function(e) {
        e.preventDefault();
        $("body").toggleClass("sidenav-toggled");
        $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
        $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
    });
    // Force the toggled class to be removed when a collapsible nav link is clicked
    $(".navbar-sidenav .nav-link-collapse").click(function(e) {
        e.preventDefault();
        $("body").removeClass("sidenav-toggled");
    });
    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });
});

function enviarFormulario() {
    if(validarFormulario()) {
        console.log('formulario valido');
        recuperarPassword();
    }else{
        console.log('formulario invalido');
    }
}

function recuperarPassword(){
    let xmlHttpRequest = new XMLHttpRequest();
    let url = "http://178.128.228.106:8086/recover/password";
    let response = undefined;
    let email = $('#formEmail').val();
    let object = {
        'email': email
    };
    let json = JSON.stringify(object);
    xmlHttpRequest.open("POST",url,true);
    xmlHttpRequest.setRequestHeader('Content-Type','application/json');
    xmlHttpRequest.onreadystatechange = ( respuesta ) => {
        if(xmlHttpRequest.readyState == 4) {
            if(xmlHttpRequest.status == 200){
                response = respuesta.target.response;
                console.log(response)
                alert("Se envio la informacion a su correo electronico");
            }
            if(xmlHttpRequest.status == 500) {
                alert("No existe la direccion de correo electronico");
            }
        }
    };
    xmlHttpRequest.send(json);
}

function validarFormulario() {
    let res = true;
    let entradaEmail = $("#formEmail");
    let email = entradaEmail.val();
    let validarEmail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    let validacionEmail = validarEmail.test(email);

    if(validacionEmail){
        res = res && true;
    }else{
        res = res && false;
        entradaEmail.attr("class","form-control is-invalid");
    }
    return res;
}

function correccionEmail(){
    let entradaEmail = $("#formEmail");
    entradaEmail.attr("class","form-control");
}