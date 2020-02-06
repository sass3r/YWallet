const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('get-user-view',(event,user)=>{
  currentUser = user;
  console.log('currentUser :'+currentUser);
});


$(document).ready(function(){
  let botonCambio = $("#botonCambio");
  let formularioPassword = $("#formPassword");
  let currentUser = undefined;
  $('#transf').hide();
  ipc.send('get-user','get-user-view');

  botonCambio.click(function(){
    cambiarPassword();
  });

  formularioPassword.submit(function(event){
    event.preventDefault();
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

function generarJSON(){
  let object = {};
  let formData = new FormData(document.forms.namedItem("formPassword"));
  formData.forEach((value, key) =>  {
    object[key] = value;
  });
  let json = JSON.stringify(object);
  return json;
}

function enviarJSON(json, idUser) {
  console.log(json);
  console.log(idUser);
  let xmlHttpRequest = new XMLHttpRequest();
  let action = "http://178.128.228.106:8086/users/"+idUser;
  console.log(action);
  xmlHttpRequest.open("PUT",action,true);
  xmlHttpRequest.setRequestHeader('Content-Type','application/json');
  xmlHttpRequest.onreadystatechange = function(respuesta){
    if(xmlHttpRequest.readyState == 4){
      if(xmlHttpRequest.status == 200){
        let response = respuesta.target.response;
        console.log(response);
        alert("Contraseña cambiada satisfactoriamente");
        location.href = "saldo.html";
      }

      if(xmlHttpRequest.status == 401){
        alert("La contraseña es incorrecta");
      }
    }
  };
  xmlHttpRequest.send(json);
}

function cambiarPassword(){
  if(validarFormulario()){
    let json = generarJSON();
    enviarJSON(json,currentUser._id);
  }
}

showTransf = (currentUser) => {
  let rol = currentUser.rol;
  if(rol == 2) {
    $('#transf').show();
  }
};

function validarFormulario(){
  let res = true;
  let entradaContraseña = $("#passwordActual");
  let contraseña = entradaContraseña.val();
  let entradaContraseñaNueva = $("#passwordNuevo");
  let contraseñaNueva = entradaContraseñaNueva.val();
  let entradaConfirmacion = $("#passwordConfirm");
  let confirmacion = entradaConfirmacion.val();
  let contenedorMensaje = $("#contenedorMensaje");
  let validarPasswd = new RegExp("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,16}$");
  let validacionContraseña = validarPasswd.test(contraseña);
  let validacionContraseñaNueva = validarPasswd.test(contraseñaNueva);
  let validacionConfirmacion = validarPasswd.test(confirmacion);

  if(validacionContraseña){
    res = res && true;
  }else{
    res = res && false;
    entradaContraseña.attr("class","form-control is-invalid");
  }

  if(validacionContraseñaNueva){
    res = res && true;
  }else{
    res = res && false;
    entradaContraseñaNueva.attr("class","form-control is-invalid");
  }

  if(confirmacion == contraseñaNueva && validacionConfirmacion){
    res = res && true;
  }else{
    res = res && false;
    entradaConfirmacion.attr("class","form-control is-invalid");
  }

  if(res == false)
    contenedorMensaje[0].style.display = "block";
  else
    contenedorMensaje[0].style.display = "none";


  return res;
}

function correccionContraseña(){
  let entradaContraseña = $("#passwordActual");
  entradaContraseña.attr("class","form-control");
}

function correccionContraseñaNueva(){
  let entradaContraseñaNueva = $("#passwordNuevo");
  entradaContraseñaNueva.attr("class","form-control");
}

function correccionConfirmacion(){
  let entradaConfirmacion = $("#passwordConfirm");
  entradaConfirmacion.attr("class","form-control");
}