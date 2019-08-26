var socket = io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var timer;
var DEFAULT_TIME = 20;
var time = DEFAULT_TIME;
var chart = null;

function elId(id){return document.getElementById(id);}

var el = {};

function initEl() {
    el = {
        tplQuestion: elId('question-template'),
        tplQPos: elId('question-pos-template'),
        tplPlayersAns: elId('players-answered-template'),
        tplTimeLeft: elId('time-left-template'),
        tplLeaderboard: elId('leaderboard-template'),
        ques: document.getElementsByClassName('ques')[0],
        quesArea: document.getElementsByClassName('ques__content__question-area')[0],
        question: elId('question'),
        answer: document.getElementsByClassName('answer')[0],
        answer1: elId('answer1'),
        answer2: elId('answer2'),
        answer3: elId('answer3'),
        answer4: elId('answer4'),
        playersAnswered: elId('playersAnswered'),
        timerText: elId('timerText'),
        square: document.getElementsByClassName('square')[0],
        square1: elId('square1'),
        square2: elId('square2'),
        square3: elId('square3'),
        square4: elId('square4'),
        nextQButton: elId('nextQButton'),
        winner: document.getElementsByClassName('winner')[0],
        winner1: elId('winner1'),
        winner2: elId('winner2'),
        winner3: elId('winner3'),
        winner4: elId('winner4'),
        winner5: elId('winner5'),
        winnerTitle: elId('winnerTitle'),
        leaderboard: document.getElementsByClassName('ques__leaderboard')[0],
        chart: document.getElementsByClassName('ques__chart')[0],
    };
}

initEl();

//When host connects to server
socket.on('connect', function() {
    console.log('connecting to the server!')
    
    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function(){
   window.location.href = '/';//Redirect user to 'join game' page
});

socket.on('gameQuestions', function(data){
    el.ques.classList.remove('ques--over');
    el.quesArea.innerHTML = Mustache.render(el.tplQuestion.innerHTML, data);
    el.playersAnswered.innerHTML = Mustache.render(el.tplPlayersAns.innerHTML, {
        playersAnswered: 0,
        playersInGame: data.playersInGame,
    });


    initEl();
    updateTimer(data.cd);
});

socket.on('updatePlayersAnswered', function(data){
    playersInGame = data.playersInGame;
    el.playersAnswered.innerHTML = Mustache.render(el.tplPlayersAns.innerHTML, data);
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    el.nextQButton.style.display = 'block';
    el.ques.classList.add('ques--over');
    var answer = [0, 0, 0, 0];

    el.answer.classList.add('incorrect');
    
    //Shows user correct answer with effects on elements
    var t = '&#10004 ';
    switch(correct){
        case 1:
            el.answer1.classList.remove('incorrect');
            el.answer1.innerHTML = t + el.answer1.innerHTML;
            break;
        case 2:
            el.answer2.classList.remove('incorrect');
            el.answer2.innerHTML = t + el.answer2.innerHTML;
            break;
        case 3:
            el.answer3.classList.remove('incorrect');
            el.answer3.innerHTML = t + el.answer3.innerHTML;
            break;
        case 4:
            el.answer4.classList.remove('incorrect');
            el.answer4.innerHTML = t + el.answer4.innerHTML;
            break;
    }
    
    for(var i = 0; i < playerData.length; i++){
        ++answer[playerData[i].gameData.answer-1];
    }
    
    chart = new Chartist.Bar('.ques__chart', {
        series: [answer]
    });
    
    var leadersPlayers = playerData.sort(function(a, b){
        return b.gameData.score - a.gameData.score;
    });

    if(leadersPlayers.length > 10){
        leadersPlayers = leadersPlayers.slice(0, 10);
    }

    var plyr = null;
    var leaders = [];

    for(var i=0; i<leadersPlayers.length; ++i) {
        plyr = {
            rank: i+1,
            name: leadersPlayers[i].name,
            score: leadersPlayers[i].gameData.score,
        };

        leaders.push(plyr);
    }

    el.leaderboard.innerHTML = Mustache.render(el.tplLeaderboard.innerHTML, {
        players: leaders
    });
});

function nextQuestion(){
    el.nextQButton.style.display = "none";
    el.chart.innerHTML = '';
    el.answer.classList.remove('incorrect');
    
    el.playersAnswered.style.display = "block";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer(cd){
    time = DEFAULT_TIME;

    if(cd != null && cd != undefined && typeof cd == 'number') {
        time = cd;
    }

    timer = setInterval(function(){
        --time;
        el.timerText.innerHTML = Mustache.render(el.tplTimeLeft.innerHTML, {time: time});
        if(time == 0){
            socket.emit('timeUp');
            clearTimeout(timer);
        }
    }, 1000);
}
socket.on('GameOver', function(data){
    initEl();
    el.nextQButton.style.display = "none";
    
    el.question.innerHTML = "GAME OVER";
    el.ques.style.display = 'none';
    
    el.winner.style.display = 'block';
    el.winnerTitle.style.display = "block";
    
    el.winner1.innerHTML = "1. " + data.num1;
    el.winner2.innerHTML = "2. " + data.num2;
    el.winner3.innerHTML = "3. " + data.num3;
    el.winner4.innerHTML = "4. " + data.num4; 
    el.winner5.innerHTML = "5. " + data.num5;
});



socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});




















