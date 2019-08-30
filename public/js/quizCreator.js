var socket = io();
var questionNum = 0;
var questionFieldTemplate = document.querySelector('#question-field-template').innerHTML;

function deleteQuestion(qNo) {
    var allQuestions = document.getElementsByClassName('question-field');
    var allQuestionsLength = allQuestions.length;

    for(var i=qNo; i<allQuestionsLength; ++i) {
        moveQuestionDown(i);
    }

    var toDelete = document.getElementById('question-' + allQuestionsLength);

    // if ( allQuestions.length > 1 ) {
    toDelete.remove();
    --questionNum;

    // add question when there is only one question
    if ( allQuestionsLength == 1 ) {
        addQuestion();
    }
    // } else {
        
    // }
}

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
        cd = parseInt(document.querySelector('#cd'+qNo).value);
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

function validateQuiz(quiz) {
    var errorMsg = '';
    var errors = false;
    if (quiz.name == null || quiz.name == undefined || quiz.name == '') {
        errors = true;
        errorMsg += 'Quiz name cannot be empty!\n';
    }

    for(var i=0; i<quiz.questions.length; ++i){
        if (quiz.questions[i].question == null ||
                quiz.questions[i].question == undefined ||
                quiz.questions[i].question == '') {
            errors = true;
            errorMsg += 'Question cannot be empty! (in q'+(i+1)+')\n';
        }

        if (quiz.questions[i].answers[0] == null ||
                quiz.questions[i].answers[0] == undefined ||
                quiz.questions[i].answers[0] == '') {
            errors = true;
            errorMsg += 'Please input atleast 2 options! (in q'+(i+1)+'a1)\n';
        }

        if (quiz.questions[i].answers[1] == null ||
                quiz.questions[i].answers[1] == undefined ||
                quiz.questions[i].answers[1] == '') {
                    errors = true;
            errorMsg += 'Please input atleast 2 options! (in q'+(i+1)+'a2)\n';
        }    }

    if(errors) {
        alert(errorMsg);
    }

    return !errors;
}

function updateDatabase(){
    var name = document.getElementById('name').value;

    var quiz = {id: 0, "name": name, "questions": getAllQuestions()};

    if(validateQuiz(quiz)){
        socket.emit('newQuiz', quiz);
    }
}

//Called when user wants to exit quiz creator
function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../";
    }
}

socket.on('gameSaved', function(data){
    window.location.href = '/create';
});

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