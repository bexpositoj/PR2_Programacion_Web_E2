
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


let pokeListaCompleta = [];
let pokeFiltrados = new PokemonList();
let currentIndex = 0;
const botonCargarMas = document.getElementById("loadMore");
const contenedor = document.getElementById("resultados");

// Inputs de filtros.
const busquedaTexto = document.getElementById("searchInput");
const pesoMin = document.getElementById("weightMin");
const pesoMax = document.getElementById("weightMax");
const selectorOrden = document.getElementById("orden");
const botonFiltrar = document.getElementById("searchButton");

const pageSize = 12; // Número de pokémons por página que consideréis oportuno
const totalPokemons = 151; // Total de pokémons a cargar,

let currentURL = `${config.apiBaseUrl}`+`${totalPokemons}`; // URL inicial para obtener los pokémons

// Definimos al usuario con los datos de la sesión actual.
let user;
const cadenaSesion = sessionStorage.getItem( "ActualSession" );
if ( cadenaSesion ) {
    user = User.fromJSON( JSON.parse( cadenaSesion ) );
}


        /////////////////////
        //     Eventos     //
        /////////////////////


// Evento para inicializar la lista.
document.addEventListener( "DOMContentLoaded", inicializacion );


// Botón para mostrar más pokemons en pantalla.
botonCargarMas.addEventListener('click', () => {
    if ( currentIndex >= pokeFiltrados.length ){
        botonCargarMas.style.backgroundColor = '#F19849';
    } else {
        botonCargarMas.style.backgroundColor = '#4998F1';
        mostrarPokemons();
    }
});


// Evento para controlar los clicks que se hacen a la "tarjeta" del pokemon.
contenedor.addEventListener('click', ( event ) => {
    const target = event.target; // Elemento que ha sido clicado dentro de lcontenedor.
    const pokemonId = Number(target.id.substring(2)); // Quitamos las 2 primeras letras para tener solo el id.

    // Comprobamos si lo que se pulsó es un botón.
    if (target.tagName === 'BUTTON') {
        const accion = target.id.slice(0, 2); // Recogemos las 2 primeras letras del id.
        

        switch ( accion ) { // Con las 2 primeras letras del Id del botón, decidimos que acción realizar.

            case 'W+': // Se añade a deseados.

                for ( const pokemon of pokeListaCompleta ){
                    if ( pokemon.id === pokemonId ) {
                        user.manageList( new Pokemon( pokemon ), "wishes", "add" );
                        target.id = `W-${pokemonId}`;
                        target.textContent = "Deseados -"
                        alert("Se ha añadido el pokemon a favoritos.");
                    }
                }

            break;

            case 'W-': // Se elimina de deseados.

                for ( const pokemon of pokeListaCompleta ){
                    if ( pokemon.id === pokemonId ) {
                        user.manageList( new Pokemon( pokemon ), "wishes", "remove" );
                        target.id = `W+${pokemonId}`;
                        target.textContent = "Deseados +"
                        alert("Se ha eliminado el pokemon de favoritos.");
                    }
                }

            break;

            case 'T+': // Se añade al equipo.

                for ( const pokemon of pokeListaCompleta ){
                    if ( pokemon.id === pokemonId ) {
                        if ( user.MyTeam.length < 6 ) {
                            user.manageList( new Pokemon( pokemon ), "myTeam", "add" );
                            target.id = `T-${pokemonId}`;
                            target.textContent = "Equipo -"
                            alert("Se ha añadido el pokemon al equipo.");
                        } else {
                            alert("No puedes tener un equipo mayor a 6 pokemons.");
                        }
                    } 
                }

            break;

            case 'T-': // Se elimina del equipo.

                for ( const pokemon of pokeListaCompleta ){
                    if ( pokemon.id === pokemonId ) {
                        user.manageList( new Pokemon( pokemon ), "myTeam", "remove" );
                        target.id = `T+${pokemonId}`;
                        target.textContent = "Equipo +"
                        alert("Se ha eliminado el pokemon del equipo.");
                    } 
                }


            break;

            default:

        }

        actualizarUsuario( user );

    } else if ( target.id !== "resultados" ) { // Cuando se hace click en cualquier otra parte de la tarjeta.
        const detallePokemon = { id: pokemonId };
        sessionStorage.setItem("detalle", JSON.stringify( detallePokemon ) ); // Se almacena el id del pokemon a mostrar.
        window.location.href = '../html/detail.html';
        
    }

});


// Evento para el filtrado por busqueda.
botonFiltrar.addEventListener( "click", () =>{
    guardarFiltro();
    aplicarFiltros();
});


// Evento para el cambio de orden.
selectorOrden. addEventListener( "change", ()=>{
    guardarFiltro();
    aplicarFiltros();
});


        ///////////////////////
        //     Funciones     //
        ///////////////////////


// Función asincrona para obtener la lista de pokemons.
async function getPokemons( url = currentURL ) {

    try {
        mostrarLoader();

        // Obtenemos la lista básica de nombre y URL.
        const respuesta = await fetch( url );
        if (!respuesta.ok) throw new Error("Error al conectar con la API");
        
        const datos = await respuesta.json();
        const pokemonList = datos.results; // Array de {name, url}

        // Para cada pokémon, obtener sus detalles.
        const respuestaDetalles = pokemonList.map( async (pokemon) => {
            try {
                // Se obtienen los datos de la url de cada pokemon y dentro de estos datos, los datos de la url de 'species'.
                const res = await fetch(pokemon.url);
                if (!res.ok) throw new Error(`Error en detalles de ${pokemon.name}`);

                const details = await res.json();
                const descrip = await getPokemonDescription(details.species.url);

                // Se arma el objeto con los datos recogidos.
                return {
                    id: details.id,
                    name: details.name,
                    height: details.height,
                    weight: details.weight,
                    baseExperience: details.base_experience,
                    abilities: details.abilities.map(ab => ab.ability.name),
                    types: details.types.map(tp => tp.type.name),
                    sprites: details.sprites.other['showdown'].front_default,
                    stats: details.stats.map(st => st.base_stat),
                    description: descrip 
                };
            } catch ( error ) {
                console.error('Error parcial obteniendo detalles:', error);
                return null;
            }
        });

        const results = await Promise.all( respuestaDetalles );
        const successfulPokemons = results.filter( p => p !== null );


        ocultarLoader();
        return successfulPokemons;
    } catch ( error ) {
        console.error('Error general obteniendo pokémones:', error);
        ocultarLoader();
        throw error; // O retorna un array vacío: return [];
    }
}


// Función para obtener la descripción del pokemon.
async function getPokemonDescription( speciesUrl ) {

    try {

        const response = await fetch( speciesUrl ); // Se realiza petición de los datos.

        if ( response.ok ) {
            const speciesData = await response.json();
            
            // Busca descripción en español.
            const spanishEntry = speciesData.flavor_text_entries.find(
                entry => entry.language.name === 'es'
            );
            
            return spanishEntry ? 
                spanishEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ') : 
                "Descripción no disponible en español";
        }

        throw new Error("No se pudo obtener la especie");
        
    } catch ( error ) {
        console.error('Error crítico en getPokemonDescription:', error);
        return "Error al cargar descripción";
    }
}


// Función para mostrar el loader y desenfocar la pantalla
function mostrarLoader() {
    document.getElementById('loader').style.display = 'block';  // Mostrar el spinner
    document.body.classList.add('loading');  // Añadir clase para desenfocar el contenido
}


// Función para ocultar el loader y eliminar el desenfoque
function ocultarLoader() {
    document.getElementById('loader').style.display = 'none';  // Ocultar el spinner
    document.body.classList.remove('loading');  // Eliminar la clase de desenfoque
}


// Función para inicializar la página.
async function inicializacion() {
    try {
        const cadenaPokemons = localStorage.getItem( "ListaCompleta" );
        
        // Se revisa si hay datos en local, sino se descargan de la API.
        if ( cadenaPokemons ) {
            pokeListaCompleta = JSON.parse( cadenaPokemons );
        } else {
            pokeListaCompleta = await getPokemons();
            localStorage.setItem( "ListaCompleta", JSON.stringify( pokeListaCompleta ) );
        }

        escribirFiltro(); // Se escriben en los campos los filtros guardados en la sesión.
        guardarFiltro(); // Se guardan los filtros de los campos en la sesión.
        aplicarFiltros(); // Se aplican los filtros.

    } catch ( error ) {
        console.error( "Fallo al inicializar:", error );
    }
}


// Función para gestionar el pintado y la cantidad a mostrar.
function mostrarPokemons() {
    
    // Obtenemos el siguiente bloque de 12
    const inicio = currentIndex;
    const fin = currentIndex + pageSize;
    const bloque = pokeFiltrados.toJSON().slice(inicio, fin);
    
    // Si es la primera página, limpiamos. Si no, añadimos.
    if (currentIndex === 0) contenedor.innerHTML = "";
    
    // Aquí llamarías a tu función de crear cards
    bloque.forEach( poke => contenedor.innerHTML += mostrarTarjeta( poke ) );
    
    currentIndex += pageSize; // Preparamos el índice para la siguiente carga
    
    // Revisamos si hay más elementos en la lista para cargar y cambiamos el color del botón según el caso.
    if ( currentIndex >= pokeFiltrados.length ){
        botonCargarMas.style.backgroundColor = '#F19849';
    } else {
        botonCargarMas.style.backgroundColor = '#4998F1';
    }
}


// Realiza el dibujado de las tarjetas en la lista pokemon.
function mostrarTarjeta( pokemon ) {

    // Verificamos si el pokemon existe en la lista.
    let enEquipo = user.MyTeam.findPokemonById( pokemon.id );
    let enDeseados = user.Wishes.findPokemonById( pokemon.id );

    // Si no existe, lo representamos con un '+'.
    let pokeEnEquipo = "+";
    let pokeEnDeseados = "+";

    // Si ya existe, lo representamos con un '-'.
    if (enEquipo) pokeEnEquipo = "-"; 
    if (enDeseados) pokeEnDeseados = "-";

    // Devolvemos la estructura html de la tarjeta que representará al pokemon.
    // NOTA: Aquí hago uso del atributo "id" para almacenar la acción a realizar y el id del pokemon.
    return `<div id="ca${pokemon.id}" class="card">
                <img id="im${pokemon.id}"class="sprite" src="${pokemon.sprites}" alt="${pokemon.name}">
                <span id="id${pokemon.id}" class="pokeId">${pokemon.id}</span>
                <span id="na${pokemon.id}" class="pokeNombre">${pokemon.name}</span>
                <button id="W${pokeEnDeseados}${pokemon.id}">Deseados ${pokeEnDeseados}</button>
                <button id="T${pokeEnEquipo}${pokemon.id}">Equipo ${pokeEnEquipo}</button>
            </div>`;
}


// Función para guardar los datos de filtrado de pokemon en sessionStorage.
function guardarFiltro(){
    const datosFiltro = {
        buscar: busquedaTexto.value,
        minimo: pesoMin.value,
        maximo: pesoMax.value,
        orden: selectorOrden.value
    }

    sessionStorage.setItem( "filtrarPor", JSON.stringify( datosFiltro ) );
}


// Función que se ejecuta en la inicialización para mostrar el ultimo filtro guardado en los campos.
// Se ejecuta solo en la carga de la página.
function escribirFiltro(){
    const cadenafiltro = sessionStorage.getItem("filtrarPor");
    if ( !cadenafiltro ) return null;

    const datosFiltro = JSON.parse( cadenafiltro );
    busquedaTexto.value = datosFiltro.buscar;
    pesoMin.value = datosFiltro.minimo;
    pesoMax.value = datosFiltro.maximo;
    selectorOrden.value = datosFiltro.orden;

}


// Función que aplica el filtrado.
function aplicarFiltros(){

    const cadenafiltro = sessionStorage.getItem( "filtrarPor" ); // Datos de filtrado.
    if ( !cadenafiltro ) return null;
    const datosFiltro = JSON.parse( cadenafiltro ); 
    pokeFiltrados = new PokemonList(); // Reseteamos la lista de pokemons filtrados.
    const tempList = PokemonList.fromJSON( pokeListaCompleta ); // Lista completa temporal sobre la que trabajar.
    
    // Filtro por nombre o ID.
    if ( datosFiltro.buscar ) { 

        // Como este filtro implica la salida de 1 solo pokemon, elimino toda la lista y después añado el pokemon encontrado.
        if ( isNaN( Number( datosFiltro.buscar ) ) ) { 
            const pokemon = tempList.findPokemonByName( datosFiltro.buscar.toLowerCase() ); // Busqueda por nombre.
            tempList.removeAllPokemon(); 
            if ( pokemon ) tempList.addPokemon ( pokemon );
        } else { 
            const pokemon = tempList.findPokemonById( datosFiltro.buscar ); // Busqueda por ID.
            tempList.removeAllPokemon();
            if ( pokemon ) tempList.addPokemon ( pokemon );
        }

    }

    // Filtro por rango de peso.
    if ( datosFiltro.minimo && datosFiltro.maximo ) { // Si se tienen los 2 valores.
        const lista = tempList.getPokemonsByWeightRange( Number( datosFiltro.minimo ) * 10, Number( datosFiltro.maximo ) * 10 );
        if ( lista.length > 0 ) {
            tempList.Pokemons = lista;
        } else {
            tempList.Pokemons = [];
        }
    } else if ( datosFiltro.minimo && !datosFiltro.maximo ){ // Si se tiene solo el mínimo.
        const lista = tempList.getPokemonsByWeightRange( Number( datosFiltro.minimo ) * 10, 9999 );
        if ( lista.length > 0 ) {
            tempList.Pokemons = lista;
        } else {
            tempList.Pokemons = [];
        }
    } else if ( !datosFiltro.minimo && datosFiltro.maximo ){ // Si se tiene solo el máximo.
        const lista = tempList.getPokemonsByWeightRange( 0 , Number( datosFiltro.maximo ) * 10 );
        if ( lista.length > 0 ) {
            tempList.Pokemons = lista;
        } else {
            tempList.Pokemons = [];
        }
    }

    // Ordenado de lista.
    switch( datosFiltro.orden ){
        case 'idAsc':
            // Por defecto ya está ordenado en ascendiente. No es necesario el 'case', pero lo dejo igualemnte.
        break;
        case 'idDesc':
            tempList.sortPokemonsByIdDesc();
        break;
        case 'nameAsc':
            tempList.sortPokemonsByName();
        break;
        case 'nameDesc':
            tempList.sortPokemonsByNameDesc();
        break;
        default:
    }

    pokeFiltrados = tempList; // Se asigna la lista temporal a la lista definitiva de filtrados.


    // Se almacena copia de la lista filtrada de pokemons.
    sessionStorage.setItem("filtrados", JSON.stringify( pokeFiltrados.toJSON() ) );
    currentIndex = 0; // Reseteo del indice de pokemons a mostrar.
    mostrarPokemons(); // Se pintan las tarjetas pokemon.
}