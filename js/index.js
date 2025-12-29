
////////////////////////////////////////////////////////////////////////////////////////
//		Benjamín Expósito Jaramillo                                                   //
//		TIDM Programación web (UOC)                                                   //
//		PR 2 - Diciembre de 2025                                                      //
//		URL - https://bexpositoj.github.io/PR2_Programacion_Web_E2/html/index.html    //
//		GITHUB - https://github.com/bexpositoj/PR2_Programacion_Web_E2                //
////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////
        //     Definiciones     //
        //////////////////////////


// Formulario
const loginForm = document.getElementById('loginForm');
loginForm.reset();

// Campos
const usernameLogin = document.getElementById('username'); // Usuario
const passwordLogin = document.getElementById('password'); // Contraseña

// Botones
const registrationButton = document.getElementById('registration');
const loginButton = document.getElementById('loginButton');


        /////////////////////
        //     Eventos     //
        /////////////////////


// Evento de clic para ir a la pagina de registrar usuario.
registrationButton.addEventListener('click', () => { window.location.href = '../html/registro.html'; });

// Evento de inicio de sesión.
loginButton.addEventListener('click', () => {
    
    const users = JSON.parse(localStorage.getItem("users"));

    if( users ){
        // Hacemos una busqueda de los usuarios en localstorage y verificamos user y pass.
        const findUsuario = users.find( user => 
            user.username === usernameLogin.value && 
            user.password === passwordLogin.value
        );

        if (findUsuario){ // Si lo ha encontrado, se almacena el usuario en sessionstorage.

            sessionStorage.setItem("ActualSession", JSON.stringify( findUsuario ));
            window.location.href = '../html/indice.html';

        } else alert("Usuario o contraseña incorrectos.");

    } else alert("Usuario o contraseña incorrectos.");

});

        ///////////////////////
        //     Funciones     //
        ///////////////////////

        
// Función para comprobar si hay una sessión activa.
function usuarioLogeado(){
    const sesion = JSON.parse(sessionStorage.getItem("ActualSession"));
    if (sesion) window.location.href = '../html/indice.html';
}
usuarioLogeado();
