var socket = io();
var questionNum = 0;
var questionFieldTemplate = document.querySelector('#question-field-template').innerHTML;

function setQuestion(qNo, question) {
    var q = '#question-' + qNo;
    var quesElem = document.querySelector(q);
    var cdQSel = document.querySelector(q + ' .question-field__custom-duration__question');
    var cdResp = document.querySelector('#cd' + qNo);

    quesElem.querySelector('#q'+qNo).value = question.question;

    for(var i=0; i<4; ++i){
        document.querySelector('#q'+qNo+'a'+(i+1)).value = question.answers[i];
    }
    document.getElementById('correct' + qNo).value = question.correct;

    if (question.customDuration != null){
        cdQSel.value = 'yes';
        cdResp.value = question.customDuration;
    } else {
        cdQSel.value = 'no';
        cdResp.value = null;
    }
}

function getAllQuestions(){
    var questions = [];
    for(var i = 1; i <= questionNum; i++){
        questions.push(getQuestion(i));
    }

    return questions;
}

function getQuestion(qNo) {
    var cd = null;
    var preSel = 'q' + qNo;

    if(document.querySelector('#question-'+qNo+' .question-field__custom-duration__question').value == 'yes'){
        cd = document.querySelector('#cd'+qNo).value;
    }

    return {
        question: document.getElementById(preSel).value,
        answers: [
            document.getElementById(preSel + 'a1').value,
            document.getElementById(preSel + 'a2').value,
            document.getElementById(preSel + 'a3').value,
            document.getElementById(preSel + 'a4').value,
        ],
        correct: document.getElementById('correct' + qNo).value,
        customDuration: cd,
    };
}

function updateDatabase(){
    // var questions = [];
    var name = document.getElementById('name').value;
    // for(var i = 1; i <= questionNum; i++){
        // var question = document.getElementById('q' + i).value;
        // var answer1 = document.getElementById(i + 'a1').value;
        // var answer2 = document.getElementById(i + 'a2').value;
        // var answer3 = document.getElementById(i + 'a3').value;
        // var answer4 = document.getElementById(i + 'a4').value;
        // var correct = document.getElementById('correct' + i).value;
        // var answers = [answer1, answer2, answer3, answer4];
        // questions.push({"question": question, "answers": answers, "correct": correct})
    //     questions.push(getQuestion(i));
    // }
    
    // var quiz = {id: 0, "name": name, "questions": questions};
    var quiz = {id: 0, "name": name, "questions": getAllQuestions()};
    socket.emit('newQuiz', quiz);
}

// function addQuestion(){
//     questionNum += 1;
    
//     var questionsDiv = document.getElementById('allQuestions');
    
//     var newQuestionDiv = document.createElement("div");
    
//     var questionLabel = document.createElement('label');
//     var questionField = document.createElement('input');
    
//     var answer1Label = document.createElement('label');
//     var answer1Field = document.createElement('input');
    
//     var answer2Label = document.createElement('label');
//     var answer2Field = document.createElement('input');
    
//     var answer3Label = document.createElement('label');
//     var answer3Field = document.createElement('input');
    
//     var answer4Label = document.createElement('label');
//     var answer4Field = document.createElement('input');
    
//     var correctLabel = document.createElement('label');
//     var correctField = document.createElement('input');
    
//     questionLabel.innerHTML = "Question " + String(questionNum) + ": ";
//     questionField.setAttribute('class', 'question');
//     questionField.setAttribute('id', 'q' + String(questionNum));
//     questionField.setAttribute('type', 'text');
    
//     answer1Label.innerHTML = "Answer 1: ";
//     answer2Label.innerHTML = " Answer 2: ";
//     answer3Label.innerHTML = "Answer 3: ";
//     answer4Label.innerHTML = " Answer 4: ";
//     correctLabel.innerHTML = "Correct Answer (1-4): ";
    
//     answer1Field.setAttribute('id', String(questionNum) + "a1");
//     answer1Field.setAttribute('type', 'text');
//     answer2Field.setAttribute('id', String(questionNum) + "a2");
//     answer2Field.setAttribute('type', 'text');
//     answer3Field.setAttribute('id', String(questionNum) + "a3");
//     answer3Field.setAttribute('type', 'text');
//     answer4Field.setAttribute('id', String(questionNum) + "a4");
//     answer4Field.setAttribute('type', 'text');
//     correctField.setAttribute('id', 'correct' + String(questionNum));
//     correctField.setAttribute('type', 'number');
    
//     // newQuestionDiv.setAttribute('id', 'question-field');//Sets class of div
    
//     newQuestionDiv.appendChild(questionLabel);
//     newQuestionDiv.appendChild(questionField);
//     newQuestionDiv.appendChild(document.createElement('br'));
//     newQuestionDiv.appendChild(document.createElement('br'));
//     newQuestionDiv.appendChild(answer1Label);
//     newQuestionDiv.appendChild(answer1Field);
//     newQuestionDiv.appendChild(answer2Label);
//     newQuestionDiv.appendChild(answer2Field);
//     newQuestionDiv.appendChild(document.createElement('br'));
//     newQuestionDiv.appendChild(document.createElement('br'));
//     newQuestionDiv.appendChild(answer3Label);
//     newQuestionDiv.appendChild(answer3Field);
//     newQuestionDiv.appendChild(answer4Label);
//     newQuestionDiv.appendChild(answer4Field);
//     newQuestionDiv.appendChild(document.createElement('br'));
//     newQuestionDiv.appendChild(document.createElement('br'));
//     newQuestionDiv.appendChild(correctLabel);
//     newQuestionDiv.appendChild(correctField);
    
//     questionsDiv.appendChild(document.createElement('br'));//Creates a break between each question
//     questionsDiv.appendChild(newQuestionDiv);//Adds the question div to the screen
    
//     // newQuestionDiv.style.backgroundColor = randomColor();
// }

//Called when user wants to exit quiz creator
function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../";
    }
}

socket.on('gameSaved', function(data){
    window.location.href = '/create';
});

// function randomColor(){
    
//     var colors = ['#4CAF50', '#f94a1e', '#3399ff', '#ff9933'];
//     var randomNum = Math.floor(Math.random() * 4);
//     return colors[randomNum];
// }

// function setBGColor(){
    // var randColor = randomColor();
//     document.getElementById('question-field').style.backgroundColor = randColor;
// }

function addQuestion() {
    ++questionNum;

    var allQDiv = document.getElementById('all-questions');
    var newQDiv = document.createElement("div");

    newQDiv.setAttribute('class', 'question-field');
    newQDiv.setAttribute('id', 'question-'+questionNum);
    newQDiv.innerHTML = Mustache.render(
        questionFieldTemplate, 
        {
            question_no: questionNum,
        });

    allQDiv.appendChild(newQDiv);
}

function customDurationResponse(qNo){
    var cdSelctor = '#question-' + qNo + ' .question-field__custom-duration__';
    var cdSel = document.querySelector(cdSelctor+'question');

    var cdRsponse = document.querySelector(cdSelctor+'response');

    if(cdSel.value == 'yes'){
        cdRsponse.style.display = 'inline-block';
    } else {
        cdRsponse.style.display = 'none';
    }
}

function moveQuestionUp(qNo) {
    if (qNo > 1) {
        var thisQ = getQuestion(qNo);
        var prevQ = getQuestion(qNo - 1);
        
        setQuestion(qNo - 1, thisQ);
        setQuestion(qNo, prevQ);
    }
}

function moveQuestionDown(qNo) {
    if (qNo < questionNum) {
        var thisQ = getQuestion(qNo);
        var nextQ = getQuestion(qNo + 1);
        
        setQuestion(qNo + 1, thisQ);
        setQuestion(qNo, nextQ);
    }
}



(function () {
    addQuestion();
})();