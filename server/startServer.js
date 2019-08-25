/**
 * new server script (In Progress)
 */

//Import dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');

let {DbManager} = require('./utils/dbUtils');
let dbManager = new DbManager();

let app = express();
app.use()
let server = http.createServer(app);
let io = socketIO(server);


function usernameSetInCookie(cookieStr) {
    if (/username/.test(cookieStr)){
        return true;
    }

    return false;
}

function getUsernameFromCookie(cookieStr) {
    let a = cookieStr.split('username=');
    let secondpart = a[1].split(';');

    return secondpart[0];
}

app.use(express.static(publicPath));

// Start server on port 3000
server.listen(3000, () => {
    console.log("Server started on port 3000");
});

// When connected to client
io.on('connection', (socket) => {
    // When the host wants to check login
    socket.on('check-login', (data) => {
        if (usernameSetInCookie(socket.request.headers.cookie)) {
            socket.emit('host-login-response', { login: true });
        }
    });

    // When host attempts to login
    socket.on('host-login', (data) =>{
        let cookie = socket.request.headers.cookie;

        if (!usernameSetInCookie(cookie)) {
            // var userExists = dbManager.userExists(data.username);
            // if(
            //     userExists &&
            //     dbManager.adminLogin(data.username, data.password)
            // ){
            //     socket.request.headers.cookie += '; username='+data.username;
            //     socket.emit('host-login-response', { login: true });
            // } else {
            //     socket.emit('host-login-response', {
            //         login: false,
            //         message: 'Please check you username/password and try again!',
            //     });
            // }
            dbManager.userExists(data.userExists, function(exists){
                console.log('!!');
                if(exists) {
                    socket.request.headers.cookie += '; username='+data.username;
                    socket.emit('host-login-response', { login: true });
                } else {
                    socket.emit('host-login-response', {
                        login: false,
                        message: 'Please check you username/password and try again!',
                    });
                }
            });
        } else {
            socket.emit('host-login-response', {
                login: false,
                message: 'You\'re already logged in!',
            });
        }
    });

    // When host joins for the first time
    socket.on('host-join', (data) =>{
        console.log(data);
    });

    // When host joins game
    socket.on('host-join-game', (data) => {

    });

    // When player connects for the first time
    socket.on('player-join', (params) => {

    });

    // When the player connects from game view
    socket.on('player-join-game', (data) => {

    });

    // When a host or player leaves the site
    socket.on('disconnect', () => {

    });

    // Sets data in player class to answer from player
    socket.on('playerAnswer', function(num){

    });
    
    socket.on('getScore', function(){
        var player = players.getPlayer(socket.id);
        socket.emit('newScore', player.gameData.score); 
    });
    
    socket.on('time', function(data){
        var time = data.time / 20;
        time = time * 100;
        var playerid = data.player;
        var player = players.getPlayer(playerid);
        player.gameData.score += time;
    });

    socket.on('timeUp', function(){

    });

    socket.on('nextQuestion', function(){

    });
    
    // When the host starts the game
    socket.on('startGame', () => {
        var game = games.getGame(socket.id);//Get the game based on socket.id
        game.gameLive = true;
        socket.emit('gameStarted', game.hostId);//Tell player and host that game has started
    });
    
    // Give user game names data
    socket.on('requestDbNames', function(){
        
        // MongoClient.connect(DB_CONFIG.url, function(err, db){
        //     if (err) throw err;
    
        //     var dbo = db.db(DB_CONFIG.dbName);
        //     dbo.collection(DB_CONFIG.qSetCollection).find().toArray(function(err, res) {
        //         if (err) throw err;
        //         socket.emit('gameNamesData', res);
        //         db.close();
        //     });
        // });
    });
    
    socket.on('newQuiz', function(data){
        // MongoClient.connect(DB_CONFIG.url, function(err, db){
        //     if (err) throw err;
        //     var dbo = db.db(DB_CONFIG.dbName);
        //     dbo.collection(DB_CONFIG.qSetCollection).find({}).toArray(function(err, result){
        //         if(err) throw err;
        //         var num = Object.keys(result).length;
        //         if(num == 0){
        //         	data.id = 1
        //         	num = 1
        //         }else{
        //         	data.id = result[num -1 ].id + 1;
        //         }
        //         var game = data;
        //         dbo.collection(DB_CONFIG.qSetCollection).insertOne(game, function(err, res) {
        //             if (err) throw err;
        //             db.close();
        //         });
        //         db.close();
        //         socket.emit('gameSaved', num);
        //     });
        // });
    });
});