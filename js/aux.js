
////////////////////////////////////////////////////////////////////////////////////////
//		Benjamín Expósito Jaramillo                                                   //
//		TIDM Programación web (UOC)                                                   //
//		PR 2 - Diciembre de 2025                                                      //
//		URL - https://bexpositoj.github.io/PR2_Programacion_Web_E1/html/index.html    //
//		GITHUB - https://github.com/bexpositoj/PR2_Programacion_Web_E1                //
////////////////////////////////////////////////////////////////////////////////////////


        ///////////////////////
        //     Funciones     //
        ///////////////////////


// Función para actualizar los datos del usuario, tanto de sesión como locales.
function actualizarUsuario( usuario ) {
    // Obtenemos la cadena del localStorage.
    const cadenaUsers = localStorage.getItem( "users" );
    
    // Se actualiza la sesión actual.
    sessionStorage.setItem("ActualSession", JSON.stringify( usuario ) );

    if ( cadenaUsers ) {
        
        // Convertimos la cadena a un Array de objetos ("parseamos").
        let listaUsuarios = JSON.parse( cadenaUsers );

        // Buscamos el índice (posición) del usuario que queremos actualizar.
        const indice = listaUsuarios.findIndex( usu => usu.username === usuario.Username );

        if (indice !== -1) {
            // Sustituimos el usuario viejo por el nuevo objeto actualizado.
            listaUsuarios[indice] = usuario;

            // Guardamos el array actualizado en localStorage.
            localStorage.setItem( "users", JSON.stringify( listaUsuarios ) );

        }

    }

}