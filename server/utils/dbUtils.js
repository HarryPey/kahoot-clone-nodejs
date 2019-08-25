// import { Game } from './Game';

const DB_CONFIG = require('./dbConfig.json');

let MongoClient = require('mongodb').MongoClient;
let mongoose = require('mongoose');

class DbManager {
    constructor(){
        console.log(DB_CONFIG);
    }

    getUsers(username) {
        MongoClient.connect(DB_CONFIG.url, function(err, db) {
            if (err) throw err;

            let dbo = db.db(DB_CONFIG.dbName);
            let query = { username:  username };

            let cursor = dbo.collection(DB_CONFIG.qSetCollection)
                    .find(query)
                    .project({username: 1})
                    .toArray(function(err, result){
                        if(err) throw err;

                        if(result[0] !== undefined){
                            return true;
                        }

                        return false;
                    });
        });
    }

    userExists(username, fn) {
        MongoClient.connect(DB_CONFIG.url, function(err, db) {
            if (err) throw err;

            let dbo = db.db(DB_CONFIG.dbName);
            let query = { username:  username };

            let cursor = dbo.collection(DB_CONFIG.qSetCollection)
                    .find(query)
                    .project({username: 1})
                    .toArray(function(err, result){
                        if(err) throw err;
                        console.log(result);
                        fn(result[0] !== undefined);
                    });
            // let count = await cursor.count();
            // console.log(count);
        });
    }

    adminLogin(username, password) {

    }

    createLobby(){
        MongoClient.connect(DB_CONFIG.url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(DB_CONFIG.dbName);
            var query = { id:  parseInt(data.id)};
            dbo.collection(DB_CONFIG.qSetCollection).find(query).toArray(function(err, result){
                if(err) throw err;
                
                //A kahoot was found with the id passed in url
                if(result[0] !== undefined){
                    var gamePin = Math.floor(Math.random()*90000) + 10000; //new pin for game

                    games.addGame(gamePin, socket.id, false, {playersAnswered: 0, questionLive: false, gameid: data.id, question: 1}); //Creates a game with pin and host id

                    var game = games.getGame(socket.id); //Gets the game data

                    socket.join(game.pin);//The host is joining a room based on the pin

                    console.log('Game Created with pin:', game.pin); 

                    //Sending game pin to host so they can display it for players to join
                    socket.emit('showGamePin', {
                        pin: game.pin
                    });
                }else{
                    socket.emit('noGameFound');
                }
                db.close();
            });
        });
    }
}

module.exports = { DbManager };