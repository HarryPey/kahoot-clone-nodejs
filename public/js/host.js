var socket = io();
var params = jQuery.deparam(window.location.search);

var playersArea = document.getElementById('players');
var playersInfoLine = document.getElementById('players-info-line');
var playerCount = document.getElementById('player-count');

//When host connects to server
socket.on('connect', function() {
    // document.getElementById('players').value = "";
    // playersArea.innerHTML = "Waiting for players to join...";
    //Tell server that it is host connection
    socket.emit('host-join', params);
});

socket.on('showGamePin', function(data){
   document.getElementById('gamePinText').innerHTML = data.pin;
});

//Adds player's name to screen and updates player count
socket.on('updatePlayerLobby', function(data){    
    // document.getElementById('players').value = "";
    playersArea.innerHTML = "";
    var playerElement = null;
    var playerText = null;

    playersInfoLine.style.display = 'block';
    playerCount.innerHTML = data.length;
    
    for(var i = 0; i < data.length; i++){
        // document.getElementById('players').value += data[i].name + "\n";
        playerElement = document.createElement('div');
        playerText = document.createTextNode(data[i].name);
        playerElement.appendChild(playerText);

        playersArea.appendChild(playerElement);

        playersArea.scrollTop = playersArea.scrollHeight;
        // playersArea.innerHTML += data[i].name + "\n";
    }
    
});

//Tell server to start game if button is clicked
function startGame(){
    socket.emit('startGame');
}
function endGame(){
    window.location.href = "/";
}

//When server starts the game
socket.on('gameStarted', function(id){
    console.log('Game Started!');
    window.location.href="/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

