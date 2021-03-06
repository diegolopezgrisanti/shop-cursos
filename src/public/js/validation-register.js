let form = document.querySelector(".form-register");
let inputName = document.querySelector("#name");
let inputLastname = document.querySelector("#lastname");
let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#password");
let inputRePassword = document.querySelector("#rePassword");

let inputAvatar = document.querySelector('#avatar');
let divErrorAvatar = document.querySelector('div.avatar-error');

let errorMessages = {
    required: '<small class="text-danger">Este campo no debe estar vacío</small>',
    maxCharacters: '<small class="text-danger">Este campo no puede superar los 100 caracteres</small>',
    minCharactersPassword: '<small class="text-danger">La contraseña debe tener minimo 4 caracteres</small>',
    maxCharactersPassword: '<small class="text-danger">La contraseña no puede superar los 100 caracteres</small>',
    regexName: '<small class="text-danger">El nombre solo debe contener letras</small>',
    regexLastname: '<small class="text-danger">El apellido solo debe contener letras</small>',
    regexEmail: '<small class="text-danger">El email que está ingresando no es válido</small>',
    equalsPassword: '<small class="text-danger">Las contraseñas deben ser iguales</small>',
    imageError: "<small class='text-danger'>Ingrese una imagen valida(jpg, png).</small>"
}

let errors = {};

form.addEventListener("submit", function(e) {
    validateInputName();
    validateInputLastname();
    validationInputEmail();
    validationInputPassword();
    validationInputRePassword();
    validateAvatar();

    if (Object.keys(errors).length > 0) {
        e.preventDefault();
    } 

})

/**
 * Name
 */
inputName.addEventListener("blur", function() {
    validationInputName();
})

/**
 * Lastname
 */
inputLastname.addEventListener("blur", function() {
    validationInputLastname();
})

/**
 * Email
 */
inputEmail.addEventListener("blur", function() {
    validationInputEmail();
})

/**
 * Password
 */
inputPassword.addEventListener("blur", function() {
    validationInputPassword();
})

/**
 * rePassword
 */
inputRePassword.addEventListener("blur", function() {
    validationInputRePassword();
})

/**
 * Avatar
 */
inputAvatar.addEventListener('change', function() {
    validateAvatar();
})

function validationInputName () {
    let regexName = /^[a-zA-Z ]+$/;
    if (inputName.value == "") {
        errors.name = true;
        document.querySelector(".name").innerHTML = errorMessages.required;
    } 
    else if (!regexName.test(inputName.value)) {
        errors.name = true;
        document.querySelector(".name").innerHTML = errorMessages.regexName;
    }
    else if (inputName.value.length > 100){
        errors.name = true;
        document.querySelector(".name").innerHTML = errorMessages.maxCharacters;
    } else {
        delete errors.name;
        document.querySelector(".name").innerHTML = "";
    }    
}

function validationInputLastname () {
    let regexLastname = /^[a-zA-Z ]+$/;
    if (inputLastname.value == "") {
        errors.lastname = true;
        document.querySelector(".lastname").innerHTML = errorMessages.required;
    } 
    else if (!regexLastname.test(inputLastname.value)) {
        errors.lastname = true;
        document.querySelector(".lastname").innerHTML = errorMessages.regexLastname;
    }
    else if (inputLastname.value.length > 100){
        errors.lastname = true;
        document.querySelector(".lastname").innerHTML = errorMessages.maxCharacters;
    } else {
        delete errors.lastname;
        document.querySelector(".lastname").innerHTML = "";
    }    
}

function validationInputEmail() {
    let regexEmail= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if(!regexEmail.test(inputEmail.value)){         
        errors.email = true;
        document.querySelector(".email").innerHTML = errorMessages.regexEmail;
//    }    
//    else if (inputEmail.value == "") {
//        error.email = true;
//        document.querySelector(".email").innerHTML = errorMessages.required;
    }
    else if (inputEmail.value.length > 100){
        errors.email = true;
        document.querySelector(".email").innerHTML = errorMessages.maxCharacters;
    } else {    
        delete errors.email;
        document.querySelector(".email").innerHTML = "";
    }
}

function validationInputPassword() {
    if (inputPassword.value.length < 4){
        errors.password = true;
        document.querySelector(".password").innerHTML = errorMessages.minCharactersPassword;
//    }
//    else if (inputPassword.value == "") {
//        errors.password = true;
//        document.querySelector(".password").innerHTML = errorMessages.required;
    } 
    else if (inputPassword.value.length > 100){
        errors.password = true;
        document.querySelector(".password").innerHTML = errorMessages.maxCharactersPassword;
    } else {
        delete errors.password;
        document.querySelector(".password").innerHTML = "";
    } 
    
}

function validationInputRePassword() {
    if (inputPassword.value != inputRePassword.value) {
        errors.rePassword = true;
        document.querySelector(".rePassword").innerHTML = errorMessages.equalsPassword;
//   } 
//   else if (inputRePassword.value.length < 4){
//        errors.rePassword = true;
//        document.querySelector(".rePassword").innerHTML = errorMessages.minCharactersPassword;
//    }
//    else if (inputPassword.value == "") {
//        errors.password = true;
//        document.querySelector(".password").innerHTML = errorMessages.required;
//    } 
//    else if (inputRePassword.value.length > 100){
//        errors.rePassword = true;
//        document.querySelector(".rePassword").innerHTML = errorMessages.maxCharacters;
    } 
    else {
        delete errors.rePassword;
        document.querySelector(".rePassword").innerHTML = "";
    } 

}

function validateAvatar() {
    const regex = /(jpg|png|jpeg)$/;
    const file = inputAvatar.files && inputAvatar.files.length ? inputAvatar.files[0] : null ;

    if (file != null && !regex.test(file.type)) {
        errors.avatar = true;
        divErrorAvatar.innerHTML = errorMessages.imageError;
    } else {
        delete errors.avatar;
        divErrorAvatar.innerHTML = '';
    }
}
