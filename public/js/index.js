var nameElem = document.querySelector('#login-wrapper input#name');
var nameLabel = document.querySelector('.label-name');
var pinElem = document.querySelector('#login-wrapper input#pin');
var pinLabel = document.querySelector('.label-pin');

function onHover(elem){
    if (!elem.className.split(' ').indexOf('show') > -1) {
        elem.classList.add('show');
    }
}

nameElem.addEventListener('keydown', function(){onHover(nameLabel);});
pinElem.addEventListener('keydown', function(){onHover(pinLabel);});
