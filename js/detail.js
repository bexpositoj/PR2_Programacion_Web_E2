
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


const botonVolver = document.getElementById("backButton");
const cadenaDetalle = sessionStorage.getItem( "detalle" );
const datosDetalle = JSON.parse( cadenaDetalle );


        /////////////////////
        //     Eventos     //
        /////////////////////


// Evento para inicializar la lista.
document.addEventListener('DOMContentLoaded', mostrarDetallesPokemon);

botonVolver.addEventListener("click", () => {
    window.location.href = '../html/indice.html';
});


        ///////////////////////
        //     Funciones     //
        ///////////////////////


// Función para mostrar los detalles del Pokemon.
function mostrarDetallesPokemon() {

    // Obtenemos el contenedor y los datos de la lista de pokemons filtrados.
    const contenedor = document.getElementById( "pokemonDetail" );
    const cadenaFiltrados = sessionStorage.getItem( "filtrados" );
    const pokeFiltrados = PokemonList.fromJSON( JSON.parse(cadenaFiltrados) );

    if ( pokeFiltrados ) {

        const pokemon = pokeFiltrados.findPokemonById( datosDetalle.id ); // Buscamos el pokemon a partir del ID.

        if ( pokemon ){

            // Modificamos el contenido del contenedor con el código html de los detalles del pokemon.
            contenedor.innerHTML = `
                    <p class="pokeId">${pokemon.ID}</p>
                    <p class="pokeNombre">Nombre: ${pokemon.Name}</p>
                    <p class="pokeNombre">Tipo: ${pokemon.Types}</p>
                    <p class="pokeNombre">Peso: ${pokemon.Weight * 0.1} kg</p>
                    <p class="pokeNombre">Altura: ${pokemon.Height*10} cm</p>
                    <img class="sprite" src="${pokemon.Sprites}" alt="${pokemon.Name}">
                    <p>${pokemon.Description}</p>
                    <div>
                        <p><b>ESTADISTICAS BASE:</b></p>
                        <p>HP: ${pokemon.Stats[0]}</p>
                        <p>Ataque: ${pokemon.Stats[1]}</p>
                        <p>Defensa: ${pokemon.Stats[2]}</p>
                        <p>Ataque Esp.: ${pokemon.Stats[3]}</p>
                        <p>Defensa Esp.${pokemon.Stats[4]}</p>
                        <p>Velocidad: ${pokemon.Stats[5]}</p>
                    </div>
                    `;
        }

    }
    
}
