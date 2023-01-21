$(document).ready(function () {
    showLogin();
    isLoggedIn();
    console.log("isLoggedIn invoked!");
});

function isLoggedIn() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Session exists, you are already logged in");
            document.getElementById("login-messages").innerHTML = "You are Logged in :)";
            showUserInfo();
        } else if (xhr.status !== 200) {
            console.log("Session not exists, you are logged out");
            document.getElementById("login-messages").innerHTML = "Welcome stranger";
            hideUserInfo();
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("loginPassword").value;

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Successful Login");
            document.getElementById("loginMessage").innerHTML   = "Successful Login";
            document.getElementById("loginMessage").style.color = "green";
            document.getElementById("login-messages").innerHTML = "You are Logged in :)";

            loggedInUsername = username;
            loggedInPassword = password;
            showUserInfo();
        } else if (xhr.status !== 200) {
            console.log("Login Failed");
            hideUserInfo();
            document.getElementById("loginMessage").innerHTML   = "username or password is incorrect";
            document.getElementById("loginMessage").style.color = "red";
        }
    };

    xhr.open('POST', 'Login?username='+username+'&password='+password);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function logout(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("loginMessage").innerHTML   = "Successful Logout";
            console.log("Successful Logout");
            document.getElementById("login-messages").innerHTML = "Welcome stranger";
            hideUserInfo();
            //showLogin();
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
            console.log("Unsuccessful Logout");
        }
    };

    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showLogin() {
    $("#login-box").show();
    $("#login-box").load("login.html");
}

function showUserInfo() {
    $("#user_info-box").show();
}

function hideUserInfo() {
    $("#user_info-box").hide();
}

function getUserInfo() {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("user info retrieved from server!");
            document.getElementById("user-info").innerHTML = createUserUpdateForm(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {
            console.log("user info didnt retrieve from server!");
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}
function createUserUpdateForm(data) {
    let html = "<form id='userUpdateForm' name='userUpdateForm' onsubmit='updateUser(); return false;'>";
    for (const x in data) {
        let category = x;
        let value1 = data[x];

        if(category === "user_id" || category === "library_id") continue;

        html += `<label for=${category}>` + category + '</label>';
        if(category === "username" || category === "email" || category === "student_id" || category === "university" ||
            category === "student_id_from_date" || category === "student_id_to_date" || category === "department") {
            let inp = `<input id=${category} name=${category} value=${value1} disabled="true">`;
            html += inp + '<br>';
            continue;
        }

        let inp = `<input type="text" id=${category} name=${category} value=${value1}>`;
        html += inp + '<br>';
    }
    html += "<input type='submit' id='changes_submit_button' value='Apply Changes'></form>";
    return html;
}

function createTableFromJSON(data) {
    let html = "<table><tr><th>ISBN</th><th>TITLE</th><th>Authors</th><th>Genre</th><th>URL</th>" +
        "<th>Photo</th><th>Pages</th><th>Pub.Year</th></tr>";
    for (const book in data) {
        html += "<tr>";
        for(const attribute in data[book]) {
            html += "<td>" + data[book][attribute] + "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

function getAllBooks() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            document.getElementById("user-info").innerHTML = createTableFromJSON(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {

        }
    };

    xhr.open('GET', 'Books');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function updateUser() {
    let form     = document.getElementById('userUpdateForm');
    let formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => (data[key] = value));
    console.log("data retrieved from form: " + JSON.stringify(data));

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("user updates form sent without error :)");
        } else if (xhr.status !== 200) {
            console.log("form sent but with error :(");
        }
    };

    xhr.open('POST', 'UpdateUser');
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

function studentLogin(){
    var divLogin = document.getElementById('divLogin')
    if (!divLogin.hasAttribute('hidden')){
        if(divLogin.innerHTML != '') {
            divLogin.setAttribute('hidden', 'true');
        }
    }
    else{
        divLogin.removeAttribute('hidden');
    }
    // let html = '<div className="aesthetic-container">'+
    //     '<h1>Welcome to e-Libraries</h1>'+
    //     '<form id="myForm" name="myForm">'+
    //         '<div className="form-floating mb-3 w-auto">'+
    //             '<input type="text" className="form-control" id="username" name="username" required>'+
    //                 '<label htmlFor="username">Username</label>'+
    //                 '<div><label id="invalidUsernameMessage"></label></div>'+
    //         '</div>'+
    //         '<div className="form-floating mb-3 w-auto">'+
    //             '<input type="Password" className="form-control" id="loginPassword" name="loginPassword" required>'+
    //                 '<label htmlFor="loginPassword">Κώδικος</label>'+
    //                 '<div><label id="loginMessage"></label></div>'+
    //         '</div>'+
    //         '<input type="button" id="login-button" value="Login" onClick="login()">'+
    //             '<input type="button" id="register-button" value="Register" onClick="window.location="register.html"">'+
    //     '</form>'+
    // '</div>'
    let login = $('#divLogin').load('login.html');
    console.log(login);
    divLogin.innerHTML += login;
}