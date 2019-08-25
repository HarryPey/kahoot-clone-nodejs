var socket = io();

var adminContentEl = document.querySelector('.admin__content');
var dashboardTemplateEl = document.querySelector('#dashboard-template');
var loginTemplateEl = document.querySelector('#login-template');

function loginFormValidate(login) {
    var usernameEl = document.querySelector('#username');
    var passwordEl = document.querySelector('#password');
    var valMsgEl = document.querySelector(
        '.admin__content__container__login__validation-message'
    );
    var valid = true;

    valMsgEl.style.display = 'none';
    valMsgEl.querySelector('ul').innerHTML = '';

    if(
        !( login.username != null &&
        login.username != undefined &&
        login.username.length > 3 )
    ) {
        valid = false;
        usernameEl.classList.add('invalid');
        var newListItem = document.createElement('li');
        newListItem.innerHTML = 'Username should be atleast 4 characters';

        valMsgEl
            .querySelector('ul')
            .innerHTML += '<li>Username should be atleast 4 characters</li>';
    } else {
        usernameEl.classList.remove('invalid');
    }

    if(
        !( login.password != null &&
        login.password != undefined &&
        login.password.length > 7)
    ) {
        valid = false;
        passwordEl.classList.add('invalid');

        valMsgEl
            .querySelector('ul')
            .innerHTML += '<li>Passoword should be atleast 8 characters</li>';
    } else {
        passwordEl.classList.remove('invalid');
    }

    if(!valid){
        valMsgEl.style.display = 'block';
    }

    return valid;
}

function login() {
    var loginPayload = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    if(loginFormValidate(loginPayload)){
        socket.emit('host-login', loginPayload);
    }
}

var tempObj = {
    activeGames: 0,
    quiz: [
        { quizLink: '#', quizName: 'q1' },
        { quizLink: '#', quizName: 'q2' },
    ],
    gamesHistory: [
        { gameLink: '#', gameName: 'g1'},
        { gameLink: '#', gameName: 'g2'},
    ]
};

adminContentEl.innerHTML = Mustache.render(loginTemplateEl.innerHTML, tempObj);

socket.on('host-login-response', function(data){
    if(data.login) {
        adminContentEl.innerHTML = Mustache.render(
            dashboardTemplateEl.innerHTML,
            tempObj
        );
    }
});

socket.emit('check-login', function(data){
    if(data.login) {
        adminContentEl.innerHTML = Mustache.render(
            dashboardTemplateEl.innerHTML,
            tempObj
        );
    }    
});
// adminContentEl.innerHTML = Mustache.render(dashboardTemplateEl.innerHTML, tempObj);
