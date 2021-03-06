let form = document.querySelector(".form-login");
let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#password");

let errorMessage = '<small class="text-danger">El campo requerido no puede estar vacío</small>';
let errorMessageEmail = '<small class="text-danger">El email no es válido</small>';
let errorMessageLengthEmail = '<small class="text-danger">El email no puede tener más de 100 caracteres</small>';
let errorMessagePassword = '<small class="text-danger">La contraseña no puede tener menos de 4 caracteres</small>';
let errorMessageLengthPassword = '<small class="text-danger">El password no puede tener más de 100 caracteres</small>';

let error;

form.addEventListener("submit", function(e) {
    validationInputEmail();
    validationInputPassword();

    if (error) {
        e.preventDefault();
    } 

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

function validationInputEmail() {
    let regexEmail= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    if (inputEmail.value == "") {
        error = true;
        document.querySelector(".email").innerHTML = errorMessage;
    }
    else if(!regexEmail.test(inputEmail.value)){         
        error = true;
        document.querySelector(".email").innerHTML = errorMessageEmail;
    }
    else if (inputEmail.value.length > 100){
        error = true;
        document.querySelector(".email").innerHTML = errorMessageLengthEmail;
    } else {    
        error = false;
        document.querySelector(".email").innerHTML = "";
    }
}

function validationInputPassword() {
    if (inputPassword.value == "") {
        error = true;
        document.querySelector(".password").innerHTML = errorMessage;
    } 
    else if (inputPassword.value.length < 4){
        error = true;
        document.querySelector(".password").innerHTML = errorMessagePassword;
    }
    else if (inputPassword.value.length > 100){
        error = true;
        document.querySelector(".password").innerHTML = errorMessageLengthPassword;
    } else {
        error = false;
        document.querySelector(".password").innerHTML = "";
    } 
    
}

