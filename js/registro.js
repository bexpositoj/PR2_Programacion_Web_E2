
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


// Usuario temporal (hace de buffer).
const tempUser = new User({
    name: "",
    surname: "",
    address: "",
    city: "",
    postalCode: "",
    email: "",
    username: "",
    password: ""
});

// Formulario
const registerForm = document.getElementById('registerForm');
registerForm.reset();

// Campos
const nameInput = document.getElementById('name'); // Nombre
const surnameInput = document.getElementById('surname'); // Apellidos
const addressInput = document.getElementById('address'); // Dirección
const citySelect = document.getElementById('city'); // Ciudad
const postalCodeInput = document.getElementById('postalCode'); // Código Postal
const emailInput = document.getElementById('email'); // Email
const usernameInput = document.getElementById('username'); // Usuario
const passwordInput = document.getElementById('password'); // Contraseña

// Botones
const saveButton = document.getElementById('save');
const loginButton = document.getElementById('loginButton');


        /////////////////////
        //     Eventos     //
        /////////////////////


// Evento de clic para ir a la pagina de loggin usuario.
loginButton.addEventListener('click', () => { window.location.href = '../html/index.html'; });


// Evento de entrada para autorellenar el email.
emailInput.addEventListener('input', (entrada) => {

    let valor = entrada.target.value;
    //console.log(valor);
    // Si el input es @ y no esta incluido el dominio, lo añade.    
    if ( valor[valor.length-1] === '@' && !valor.includes('@uoc.edu') ) {
        entrada.target.value = valor.split('@')[0] + '@uoc.edu';
    }

});


// Evento de clic para ejecutar el guardado de información.
saveButton.addEventListener('click', validarCamposYGuardar );


// Evento de perder el foco para comprobar que el codigo postal tiene una ciudad y establecerla o no.
postalCodeInput.addEventListener('blur', () => { 

    const inputCP = postalCodeInput.value.trim();
    const findCiudad = cities.find(city => city.postalCode === inputCP);

    if (findCiudad) {

        tempUser.PostalCode = inputCP; 
        tempUser.City = findCiudad.name;
        citySelect.value = findCiudad.name; 
    
    } else {

        alert("Código postal no válido.");
        postalCodeInput.value = ""; 
        citySelect.value = ""; 
    }
    
});

// Evento de cambio de opción para establecer el código postal al cambiar la ciudad.
citySelect.addEventListener('change', () => { 

    const opcionSeleccionada = citySelect.options[citySelect.selectedIndex];
    postalCodeInput.value = opcionSeleccionada.getAttribute('Postal');

});


        ///////////////////////
        //     Funciones     //
        ///////////////////////


// Se añaden las opciones a la lista junto con el codigo postal.
function añdirCiudades() {

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        option.setAttribute( 'Postal', city.postalCode ); 
        citySelect.appendChild(option);
    });
}

añdirCiudades(); // Ejecutamos.


// validar Email -> https://desarrolloweb.com/articulos/validar-email-javascript
function validarEmail(email) {
    // Expresión regular para validar un correo electrónico
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return !regex.test(email);
}

// Validar Password -> https://comunidad.apphive.io/t/5-tipos-de-validacion-de-contrasenas/2176
function validarPassword(value) {
    // Regla: Mínimo 8 caracteres, letras, números y al menos un carácter especial.
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%#?&.,])[A-Za-z\d@$!%*#?&.,]{8,}$/;
    return !regex.test(value);
}


// Función para validar y guardar datos.
function validarCamposYGuardar() {
    let errores = [];

    // Validación de No Vacío
    if ( nameInput.value.trim() === "" ) errores.push("Nombre: No puede estar vacío.");
    if ( surnameInput.value.trim() === "" ) errores.push("Apellidos: No pueden estar vacíos.");
    if ( addressInput.value.trim() === "" ) errores.push("Dirección: No puede estar vacía.");
    if ( usernameInput.value.trim() === "" ) errores.push("Usuario: No puede estar vacío.");
    if ( citySelect.value === "" ) errores.push("Población: Debe seleccionar una población.");
    if ( validarEmail(emailInput.value) ) errores.push("Email: No puede estar vacío o ser incorrecto.");
    if ( validarPassword( passwordInput.value ) ) errores.push("Password: No puede estar vacío y a de tener mínimo 8 caracteres, letras, números y al menos un carácter especial..");
    

    if (errores.length > 0) {
        // Mostrar todos los errores en una sola alerta o lista.
        alert("Errores en el registro:\n\n" + errores.join("\n"));
        return; 
    }

    tempUser.Name = nameInput.value;
    tempUser.Surname = surnameInput.value;
    tempUser.Address = addressInput.value;
    tempUser.City = citySelect.value;
    tempUser.PostalCode = postalCodeInput.value; 
    tempUser.Email = emailInput.value;
    tempUser.Username = usernameInput.value;
    tempUser.Password = passwordInput.value;
    
    const saveResult = tempUser.save();
    
    if ( !saveResult ) {
        alert( "Error: Ya existe un usuario con ese nombre de usuario." );
        usernameInput.focus();
        return;
    }
    
    // Informamos y volvemos a la página de login.
    alert(`Usuario registrado: ${tempUser.Username}`);
    window.location.href = '../html/index.html';
}