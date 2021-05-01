const pass = document.querySelector("#pass");
const newPassword = document.querySelector("#newPassword");
const alertInput = document.querySelector("#alertInput");

function generatePassword() {

    newPassword.innerHTML = ""; //clean previous password


    let charset = "abcdefghijlkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = ""

    for (var i = 0, n = charset.length; i < pass.value; i++) {
        password += charset.charAt(Math.floor(Math.random() * n)); //choose a random character in the string
    }

    let result = document.createTextNode(password);
    return newPassword.appendChild(result);
}

function validationText() {

    alertInput.innerHTML = "";
    console.log(pass.value);

    if (pass.value == "") {
        alert = document.createTextNode("Type a password length!");
        pass.value = "";
    } else if (pass.value > 50) {
        alert = document.createTextNode("Type a number lower or equal to 50");
        pass.value = "";
    } else {
        alert = "";
    }
    return alertInput.appendChild(alert);
}