$(document).ready(function(){
    let botonIniciarSesion = $('#botonLogin');
    let token = undefined;

    botonIniciarSesion.click(function(){
        iniciarSesion();
        location.href = "saldo.html";
    });

});

function iniciarSesion(){
    let xmlHttpRequest = new XMLHttpRequest();
    let url = "http://192.168.1.4:8085/login";
    let response = undefined;
    let email = $('#formEmail').val();
    let password = $('#formPassword').val();
    let object = {
        'email': email,
        'password': password,
    };
    let json = JSON.stringify(object);
    xmlHttpRequest.open("POST",url,true);
    xmlHttpRequest.setRequestHeader('Content-Type','application/json');
    xmlHttpRequest.onreadystatechange = ( respuesta ) => {
        if(xmlHttpRequest.readyState == 4) {
            if(xmlHttpRequest.status == 200){
                response = respuesta.target.response;
                token = response.token;
                console.log(response)
            }
        }
    };
    xmlHttpRequest.send(json);
}
