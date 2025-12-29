
////////////////////////////////////////////////////////////////////////////////////////
//		Benjamín Expósito Jaramillo                                                   //
//		TIDM Programación web (UOC)                                                   //
//		PR 2 - Diciembre de 2025                                                      //
//		URL - https://bexpositoj.github.io/PR2_Programacion_Web_E2/html/index.html    //
//		GITHUB - https://github.com/bexpositoj/PR2_Programacion_Web_E2                //
////////////////////////////////////////////////////////////////////////////////////////


										////////////////////
										//     CLASES     //
										////////////////////


// Definición de la clase User.
class User {
	#name;
	#surname;
	#address;
	#city;
	#postalCode;
	#email;
	#username;
	#password;
	#myTeam;
	#wishes;

		/////////////////////////
		//     Constructor     //
		/////////////////////////

	constructor({ name, surname, address, city, postalCode, email, username, password, myTeam = new PokemonList(), wishes = new PokemonList() }) {
		this.#name = name;
		this.#surname = surname;
		this.#address = address;
		this.#city = city;
		this.#postalCode = postalCode;
		this.#email = email;
		this.#username = username;
		this.#password = password;
		this.#myTeam = myTeam;
		this.#wishes = wishes;
	}

		/////////////////////
		//     Getters     //
		/////////////////////

	get Name() { return this.#name; }
	get Surname() { return this.#surname; }
	get Address() { return this.#address; }
	get City() { return this.#city; }
	get PostalCode() { return this.#postalCode; }
	get Email() { return this.#email; }
	get Username() { return this.#username; }
	get Password() { return this.#password; }
	get MyTeam() { return this.#myTeam; }
	get Wishes() { return this.#wishes; }

		/////////////////////
		//     Setters     //
		/////////////////////

	// Las validaciones se hacen en la página de registro.html

	set Name(value) { this.#name = value.trim(); }
	set Surname(value) { this.#surname = value.trim(); }
	set Address(value) { this.#address = value.trim();}
	set City(value) { this.#city = value.trim(); }
	set PostalCode(value) { this.#postalCode = value; }
	set Email(value) { this.#email = value.toLowerCase(); }
	set Username(value) { this.#username = value.trim(); }
	set Password(value) { this.#password = value; }

		///////////////////////////////
		// Gestión de listas Pokémon //
		///////////////////////////////

	manageList(pokemon, listName, action) {
		let list;

		if (listName === "myTeam") {
			list = this.#myTeam;
		} else if (listName === "wishes") {
			list = this.#wishes;
		} else {
			console.log("Lista inválida");
			return null;
		}

		if (action === "add") {
			list.addPokemon(pokemon);
		} else if (action === "remove") {
			list.removePokemon(pokemon.ID);
		} else {
			console.log("Acción inválida");
		}
	}

		/////////////////////
		//     Métodos     //
		/////////////////////

	// Guarda usuario en el localstorage.
	save() {
		// Si hay datos, los verifica y almacena. Sino hay datos, los almacena directamente.
		const users = JSON.parse(localStorage.getItem("users"));
		if ( users ) {

			if (users.some(user => user.username === this.#username)) return false; // Verifica si existe.
			users.push( this.toJSON() );
			localStorage.setItem("users", JSON.stringify( users ));
			return true;

		} else localStorage.setItem("users", JSON.stringify( [this.toJSON()] )); // se añade [], porque se espera una array.

		return true;
	}

	// Busca y actualiza el usuario en el localstorage.
	update() {
		const users = JSON.parse(localStorage.getItem("users"));
		if ( users ) {

			const findUsuario = users.find( user => user.username === this.#username );
			if ( !findUsuario ) return null;

			users[index] = this.toJSON();
			localStorage.setItem("users", JSON.stringify( users ));
		}
	}

	// Se devuelve el objeto en forma de clave-valor (JSON).
	toJSON() {
		return {
			name: this.#name,
			surname: this.#surname,
			address: this.#address,
			city: this.#city,
			postalCode: this.#postalCode,
			email: this.#email,
			username: this.#username,
			password: this.#password,
			myTeam: this.#myTeam.toJSON(),
			wishes: this.#wishes.toJSON()
		};
	}

	// Se devuelve un objeto User nuevo a partir de un JSON.
	static fromJSON(userJSON) {
		return new User({
			name: userJSON.name,
			surname: userJSON.surname,
			address: userJSON.address,
			city: userJSON.city,
			postalCode: userJSON.postalCode,
			email: userJSON.email,
			username: userJSON.username,
			password: userJSON.password,
			myTeam: PokemonList.fromJSON(userJSON.myTeam),
			wishes: PokemonList.fromJSON(userJSON.wishes)
		});
	}
}



// Definición de la clase Pokemon.
class Pokemon {

	#id;
	#name;
	#height;
	#weight;
	#baseExperience;
	#abilities;
	#types;
	#sprites;
	#stats;
	#description;

		/////////////////////////
		//     Constructor     //
		/////////////////////////

	constructor( { id, name, description, height, weight, baseExperience, abilities, types, sprites, stats } ){
		this.ID = id;
		this.Name = name;
		this.Description = description;
		this.Height = height;
		this.Weight = weight;
		this.BaseExperience = baseExperience;
		this.Abilities = abilities;
		this.Types = types;
		this.Sprites = sprites;
		this.Stats = stats;
	}

		/////////////////////
		//     Getters     //
		/////////////////////
	
	get ID() { return this.#id; }
	get Name() { return this.#name; }
	get Description() { return this.#description; }
	get Height() { return this.#height; }
	get Weight() { return this.#weight; }
	get BaseExperience() { return this.#baseExperience; }
	get Abilities() { return this.#abilities; }
	get Types() { return this.#types; }
	get Sprites() { return this.#sprites; }
	get Stats() { return this.#stats; }
	
		/////////////////////
		//     Setters     //
		/////////////////////
	
	set ID(idPokemon) {
		if (!Number.isInteger( idPokemon ) || idPokemon < 0) return null;
		this.#id = idPokemon;
	}

	set Name(namePokemon) {
		if ( namePokemon.trim() === "" ) return null;
		this.#name = namePokemon.trim();
	}

	set Description(descriptionPokemon) {
		if ( descriptionPokemon.trim() === "" ) return null;
		this.#description = descriptionPokemon.trim();
	}

	set Height(heightPokemon) {
		if (!Number.isInteger( heightPokemon )  || heightPokemon < 0) return null;
		this.#height = heightPokemon;
	}

	set Weight(weightPokemon) {
		if (!Number.isInteger( weightPokemon ) || weightPokemon < 0) return null;
		this.#weight = weightPokemon;
	}

	set BaseExperience(baseExperiencePokemon) {
		if (!Number.isInteger(baseExperiencePokemon) || baseExperiencePokemon < 0) return null;
		this.#baseExperience = baseExperiencePokemon;
	}

	set Abilities(abilitiesPokemon) {
		if ( !Array.isArray(abilitiesPokemon) ) return null;
		this.#abilities = abilitiesPokemon;
	}

	set Types(typesPokemon) {
		if ( !Array.isArray(typesPokemon) ) return null;
		this.#types = typesPokemon;
	}

	set Sprites(spritesPokemon) {
		if ( spritesPokemon.trim() === "") return null;
		this.#sprites = spritesPokemon.trim();
	}

	set Stats(statsPokemon) {
		if ( !Array.isArray(statsPokemon) ) return null;
		this.#stats = statsPokemon;
	}

		/////////////////////
		//     Métodos     //
		/////////////////////

	// Se devuelve el objeto en forma de clave-valor (JSON).
	toJSON() {
		return {
			id: this.#id,
			name: this.#name,
			description: this.#description,
			height: this.#height,
			weight: this.#weight,
			baseExperience: this.#baseExperience,
			abilities: this.#abilities,
			types: this.#types,
			sprites: this.#sprites,
			stats: this.#stats
		};
	}

	// Se devuelve un objeto Pokemon nuevo a partir de un JSON.
	static fromJSON( pokemonJSON ) {
		return new Pokemon( pokemonJSON );
	}
}


// Definición de la lista pokemon.
class PokemonList {
	#pokemons;

		/////////////////////////
		//     Constructor     //
		/////////////////////////
	
	constructor() {
		this.#pokemons = [];
	}

		////////////////////
		//     Getter     //
		////////////////////

	get Pokemons() {
		return this.#pokemons;
	}

		////////////////////
		//     Setter     //
		////////////////////

	set Pokemons (lista){
		// Validar que sea un array
		if ( !Array.isArray(lista) ) return;

		// Validar que todos los elementos sean instancias de Pokemon
		const allArePokemon = lista.every( pokemon => pokemon instanceof Pokemon );
		if ( !allArePokemon ) return;

		// Asignar la nueva lista
		this.#pokemons = lista;
	}


		/////////////////////
		//     Métodos     //
		/////////////////////


	// Añadir un Pokémon a la lista con "push()".
	addPokemon( pokemon ) {
		this.#pokemons.push( pokemon );
	}


	// Eliminar un Pokémon de la lista por ID.
	removePokemon( pokemonId ) {
		const indice = this.#pokemons.findIndex( ( pokemon ) => pokemon.ID == pokemonId );
		if ( indice > -1 ) {
			this.#pokemons.splice(indice , 1);
		}
	}

	// Eliminar todos los Pokemon de la lista.
	removeAllPokemon() {
		this.#pokemons = [];
	}


	// Añadir múltiples Pokémon a la vez.
	addMultiplePokemons = ( ...pokemons ) => {
		pokemons.forEach ( ( pokemon ) => this.addPokemon( pokemon ) );
	};


	// Mostrar la lista de Pokémon (nombre, tipo principal e imagen).
	showList() {
		this.#pokemons.forEach( ( pokemon ) => console.log( `Nombre: ${pokemon.Name} | Tipo: ${pokemon.Types[0]} | Sprite: ${pokemon.Sprites}`) );
	}


	// Añadimos la función "length()" por comodidad, para devolver la longitud de la lista.
	get length(){
		return this.#pokemons.length;
	}


	// Obtener Pokémon dentro de un rango de peso.
	getPokemonsByWeightRange = ( minWeight, maxWeight ) => {
		return this.#pokemons.filter ( ( pokemon ) => pokemon.Weight < maxWeight && pokemon.Weight > minWeight );
	};


	// Ordenar Pokémon por experiencia base.
	sortPokemonsByBaseExperience = () => {
		return this.#pokemons.sort( (a, b) => a.BaseExperience - b.BaseExperience );
	};

	// Ordenar Pokémon por ID descendente.
	sortPokemonsByIdDesc = () => {
		return this.#pokemons.sort( (a, b) => b.ID - a.ID );
	};

	// Ordenar Pokémon por nombre descendente.
	sortPokemonsByName = () => {
		return this.#pokemons.sort( (a, b) => a.Name.localeCompare(b.Name) );
	};

	// Ordenar Pokémon por nombre descendente.
	sortPokemonsByNameDesc = () => {
		return this.#pokemons.sort( (a, b) => b.Name.localeCompare(a.Name) );
	};
	
	// Función recursiva para buscar un Pokémon por ID.
	findPokemonById ( id, index = 0 ) {
	
		let i = index;
		if ( i > this.length - 1 ){
			return null; // Devolvemos 'null' a modo de dar a entender que no se ha encontrado el pokemon.
		} else if ( this.#pokemons[i].ID == id ){
			return this.#pokemons[i];
		} else {
			return this.findPokemonById( id, index + 1); // Llamada recursiva.
		}
	
	}


	// Función recursiva para buscar un Pokémon por nombre.
	findPokemonByName ( nombre, index = 0 ) {
	
		let i = index;
		if ( i > this.length - 1 ){
			return null; // Devolvemos 'null' a modo de dar a entender que no se ha encontrado el pokemon.
		} else if ( this.#pokemons[i].Name === nombre ){
			return this.#pokemons[i];
		} else {
			return this.findPokemonByName( nombre, index + 1); // Llamada recursiva.
		}
	
	}


	// Uso de reduce para encontrar el tipo más común.
	getMostCommonType () {
	
		// Creamos una variable que contendrá un recuento de los tipos de pokemon que hay en la lista, usando "reduce()".
		const recuentoTipos = this.#pokemons.reduce( ( acumulador, pokemon ) => {
	
			pokemon.Types.forEach( (tipo) => { // Recorremos los tipos que contiene el pokemon.
				
				// El acumulador almacenará cada tipo que se encuentre en forma de objeto.
				if ( acumulador[tipo] != null ){ 
					acumulador[tipo] = acumulador[tipo] +1; // Si no es "null" quiere decir que ya lo a visto y entonces le sumamos 1.
				} else { 
					acumulador[tipo] = 1; // Si es "null" no estará definido y entonces la definimos inicializandola.
				}
			});
			
			return acumulador; // Devolvemos el recuento.
	
		}, {} );
	
		// Ahora se revisa qué tipo de pokemon tiene un mayor recuento.
		let tipoComun = "";
		let contador = 0;
	
		// Se emplea la forma clasica con "for" de recorrer elementos de pares Clave-Valor.
		for ( const tipo in recuentoTipos ) {
			if ( contador < recuentoTipos[tipo] ) {
				tipoComun = tipo;
				contador = recuentoTipos[tipo];
			}
		} 
	
		return tipoComun; // Devolvemos la string con el tipo.
	}
	

	// Se emplea filter para obtener los pokemons con ataque mayor al ataque minimo y map para obtener sus nombres.
	getStrongPokemons( minAttack ) {
		
		const Pokefuertes = this.#pokemons.filter ( pokemon => pokemon.Stats["attack"] >= minAttack );
		return Pokefuertes.map( ( pokemon ) => pokemon.Name );
		
	}


	// Se devuelve el objeto en forma de clave-valor (JSON).
	toJSON() {
		if ( !this.#pokemons ) return []; // Verificamos que esté inicializada la array de pokemons.
		return this.#pokemons.map( ( pokemon ) => pokemon.toJSON() );
	}


	// Se devuelve un objeto PokemonList nuevo a partir de un JSON.
	static fromJSON( pokemonsJSON ) {
		const list = new PokemonList();

		if ( Array.isArray(pokemonsJSON) ){
			pokemonsJSON.forEach ( ( pokemonJ ) => {
				list.addPokemon( Pokemon.fromJSON( pokemonJ ) );
			});
		}

		return list;
	}

	
}