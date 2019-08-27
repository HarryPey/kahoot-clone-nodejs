var socket = io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var timer;
var DEFAULT_TIME = 20;
var time = DEFAULT_TIME;
var chart = null;
var pageTitleSet = false;

function elId(id){return document.getElementById(id);}

var el = {};

var tpl = {
    pageTitle: elId('page-title-template').innerHTML,
    question: elId('question-template').innerHTML,
    qPos: elId('question-pos-template').innerHTML,
    playersAns: elId('players-answered-template').innerHTML,
    timeLeft: elId('time-left-template').innerHTML,
    leaderboard: elId('leaderboard-template').innerHTML,
    winners: elId('winners-template').innerHTML,
};

function hide(el){ el.style.display = 'none' }
function html(el, h){ el.innerHTML = h }

function initEl() {
    el = {
        ques: document.getElementsByClassName('ques')[0],
        quesArea: document.getElementsByClassName('ques__content__question-area')[0],
        pageTitle: elId('page-title'),
        qNum: elId('questionNum'),
        question: elId('question'),
        answer: [
            elId('answer1'),
            elId('answer2'),
            elId('answer3'),
            elId('answer4')
        ],
        playersAnswered: elId('playersAnswered'),
        timerText: elId('timerText'),
        nextQButton: elId('nextQButton'),
        winner: [
            elId('winner1'),
            elId('winner2'),
            elId('winner3'),
            elId('winner4'),
            elId('winner5')
        ],
        winnerTitle: elId('winnerTitle'),
        winnerSection: elId('winner-section'),
        timeOver: elId('time-over-overlay'),
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

    if(!pageTitleSet) {
        html(el.pageTitle, Mustache.render(tpl.pageTitle, data));
    }

    pageTitleSet = true;
    html(el.qNum, Mustache.render(tpl.qPos, data));
    html(el.quesArea, Mustache.render(tpl.question, data));
    html(el.playersAnswered, Mustache.render(tpl.playersAns, {
        playersAnswered: 0,
        playersInGame: data.playersInGame,
    }));

    initEl();
    updateTimer(data.cd);
});

socket.on('updatePlayersAnswered', function(data){
    playersInGame = data.playersInGame;
    html(el.playersAnswered, Mustache.render(tpl.playersAns, data));
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    el.nextQButton.style.display = 'block';
    el.ques.classList.add('ques--over');
    var answer = [0, 0, 0, 0];

    el.answer.forEach(function(a){a.classList.add('incorrect');});
    
    //Shows user correct answer with effects on elements
    el.answer[correct-1].classList.remove('incorrect');
    
    for(var i = 0; i < playerData.length; i++){
        ++answer[playerData[i].gameData.answer-1];
    }
    
    chart = new Chartist.Bar('.ques__chart',
        { series: [ answer ] },
        { axisY: { onlyInteger: true } }
    );
    
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

    html(el.leaderboard, Mustache.render(tpl.leaderboard, {
        players: leaders
    }));
});

function nextQuestion(){
    hide(el.nextQButton);
    html(el.chart, '');
    el.answer.forEach(function(a){a.classList.remove('incorrect');});
    
    // el.playersAnswered.style.display = "block";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer(cd){
    time = DEFAULT_TIME;

    if(cd != null && cd != undefined && typeof cd == 'number') {
        time = cd;
    }

    timer = setInterval(function(){
        --time;
        html(el.timerText, Mustache.render(tpl.timeLeft, {time: time}));
        if(time == 0){
            clearTimeout(timer);
            socket.emit('timeUp');
        }
    }, 1000);
}
socket.on('GameOver', function(data){
    initEl();
    
    html(el.question, "GAME OVER");
    hide(el.nextQButton);
    hide(el.ques);
    
    var players = [];

    for(var i=0; i<data.topScores.length; ++i){
        players.push({i: i+1, name: data.topScores[i]});
    }

    var obj = {
        no: data.length,
        players: players,
    };

    html(el.winnerSection, Mustache.render(tpl.winners, obj));
});

socket.on('getTime', function(player){
    console.log('sending Time: ' + time);
    socket.emit('time', {
        player: player,
        time: time
    });
});




















