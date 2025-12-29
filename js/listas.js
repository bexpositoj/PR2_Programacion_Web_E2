
////////////////////////////////////////////////////////////////////////////////////////
//		Benjamín Expósito Jaramillo                                                   //
//		TIDM Programación web (UOC)                                                   //
//		PR 2 - Diciembre de 2025                                                      //
//		URL - https://bexpositoj.github.io/PR2_Programacion_Web_E1/html/index.html    //
//		GITHUB - https://github.com/bexpositoj/PR2_Programacion_Web_E1                //
////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////
        //     Definiciones     //
        //////////////////////////


const selector = document.getElementById("listSelector");
const contenedor = document.getElementById('listas');
const botonVolver = document.getElementById("backButton");
const cadenaSesion = sessionStorage.getItem("ActualSession"); // Datos de sesión.

let user; // Definimos al usuario con los datos de la sesión actual.
if (cadenaSesion) user = User.fromJSON( JSON.parse(cadenaSesion) );


        /////////////////////
        //     Eventos     //
        /////////////////////


// Evento para mostrar la lista por defecto al cargar el contenido.
document.addEventListener('DOMContentLoaded', displayPokeList);

// Evento para mostrar la lista según la selección.
selector.addEventListener("change", () => {

    displayPokeList();

});


// Evento para controlar los clicks que se hacen a la "tarjeta" del pokemon.
contenedor.addEventListener('click', (event) => {
    const target = event.target; // El elemento que ha sido clicado dentro del contenedor.
    let pokemonId = Number(target.id.substring(2)); // Quitamos las 2 primeras letras para tener solo el id.

    // Comprobamos si lo que se pulsó es un botón.
    if (target.tagName === 'BUTTON') {
        const accion = target.id.slice(0, 2); // Recogemos las 2 primeras letras del id.
        

        switch ( accion ) { // Con las 2 primeras letras del Id del botón, decidimos que acción realizar.

            case 'W-': // Se elimina de deseados.

                for (const pokemon of user.Wishes.Pokemons){
                    if (pokemon.ID === pokemonId) {
                        user.manageList( pokemon , "wishes", "remove" );
                        alert("Se ha eliminado el pokemon de favoritos.");
                    }
                }

            break;

            case 'T-': // Se elimina del equipo.

                for (const pokemon of user.MyTeam.Pokemons){
                    if (pokemon.ID === pokemonId) {
                        user.manageList( pokemon , "myTeam", "remove" );
                        alert("Se ha eliminado el pokemon del equipo.");
                    } 
                }

            break;
            default:
        }

        actualizarUsuario ( user );
        displayPokeList ();
    } else if ( target.id !== "listas" ) { // Cuando se hace click en cualquier otra parte de la tarjeta.
        const detallePokemon = { id: pokemonId };
        sessionStorage.setItem("detalle", JSON.stringify( detallePokemon ) ); // Se almacena el id del pokemon a mostrar.
        window.location.href = '../html/detail.html';
    }

});

botonVolver.addEventListener("click", () => { window.location.href = '../html/indice.html'; });


        ///////////////////////
        //     Funciones     //
        ///////////////////////


// Obtener la lista correspondiente del usuario
function displayPokeList () {
    const opcionSeleccionada = selector.options[selector.selectedIndex];
    
    contenedor.innerHTML = "";
    let listaAEmitir = null;
    let accion;
    
    if (opcionSeleccionada.text === listNames.myTeam) {
        listaAEmitir = user.MyTeam.Pokemons;
        accion = "T-";
    } else if (opcionSeleccionada.text === listNames.wishes) {
        listaAEmitir = user.Wishes.Pokemons;
        accion = "W-";
    }

    // Dibujamos si hay lista
    if (listaAEmitir) {
        listaAEmitir.forEach(pokemon => {
            contenedor.innerHTML += `
                <div id="ca${pokemon.ID}" class="card">
                    <img id="im${pokemon.ID}"class="sprite" src="${pokemon.Sprites}" alt="${pokemon.Name}">
                    <span id="id${pokemon.ID}" class="pokeId">${pokemon.ID}</span>
                    <span id="na${pokemon.ID}" class="pokeNombre">${pokemon.Name}</span>
                    <button id="${accion}${pokemon.ID}">Eliminar</button>
                </div>`;
        });
    }
}