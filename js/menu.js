
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


const logoutButton = document.getElementById("logoutButton"); // Botón Logout.
const menuButton = document.getElementById("menuButton"); // Botón usuario.

updateMenu(); 


        /////////////////////
        //     Eventos     //
        /////////////////////


// Evento que activa el cierre de sesión.
logoutButton.addEventListener('click', ()=> {
    sessionStorage.removeItem("ActualSession"); // Eliminamos los datos de sesión.
    window.location.href = '../html/index.html'; // Volvemos a la página de login.
}); 


        ///////////////////////
        //     Funciones     //
        ///////////////////////


// Datos de sesión.
function datosSesion(){
    const CadenaSesion = sessionStorage.getItem("ActualSession");
    if ( CadenaSesion ) return JSON.parse(CadenaSesion);
    else return 0;
}


// Función que actualiza el usuario y el número de Pokemons en cada una de las listas
function updateMenu() {
    
    const sesion = datosSesion(); // Datos de sesión.
    if (sesion) menuButton.textContent = sesion.username;
    else window.location.href = '../html/index.html'; // Volvemos a la página de login, si no hay sesión.

}
