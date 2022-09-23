//select elemnts
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results")
let countdownElemnt = document.querySelector(".countdown")


// set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;






function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            // creat bullets + set questuins count
            creatBullets(qCount);

            // /add question data
            addQuestionData(questionsObject[currentIndex], qCount);
            
            //start countDown
            countdown(5, qCount);
            
            // click on submit
            submitButton.onclick = () => {

                //get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;

                //increase index
                currentIndex++;

                // check the answer
                checkAnswer(theRightAnswer, qCount);
                
                
                //remove previous Qustions
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                
                addQuestionData(questionsObject[currentIndex], qCount);

                //handle bullets class
                handleBullets();
                
                
                //start countDown
                clearInterval(countdownInterval);
                countdown(5, qCount);


                //show results
                showResults(qCount);
            };

        }
    };


    myRequest.open("GET","html.questions.json",true);
    myRequest.send();
}


getQuestions();


function creatBullets(num) {
    countSpan.innerHTML = num;
    //creat spans
    for (let i = 0;i < num;i++) {

        //creat span
        let thBullet = document.createElement("span")
        
        //check if its first span
        if(i === 0){
            thBullet.className = "on"
        }
        //append Bullets to main container
        bulletsSpanContainer.appendChild(thBullet)
    }

}


function addQuestionData(obj, count) {

        if(currentIndex < count){

            //creat H2 question title 
            let questionTitle = document.createElement("H2");
            let questionText = document.createTextNode(obj["title"])
            
    // apppend text to h2
    questionTitle.appendChild(questionText);
    
    //append hte h2 to quiz area
    quizArea.appendChild(questionTitle);

    //creat the answers
    for(let i = 1; i <= 4; i++) {
        //creat main answer
        let mainDiv = document.createElement("div");
        
        //add class to main div
        mainDiv.className = "answer";
        
        //creat radio input
        let radioInput = document.createElement("input")
        
        //add type + name + id + data attribute
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer =  obj[`answer_${i}`];
        
        //make first option selected
        if(i == 1){
            radioInput.checked = true;
        }
        
        //creat label
        let theLabel = document.createElement("label");
        
        // add for attribute
        theLabel.htmlFor =`answer_${i}`;
        
        //creat label text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
        
        //add the text to the label
        theLabel.appendChild(theLabelText);

        //add input + label to main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        //apend all divsto answer area
        answersArea.appendChild(mainDiv);
    }
}
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
    }
}
function handleBullets() {
    let  bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if(currentIndex === index) {
            span.className = "on";
        }
    })
}
function showResults(count){
    let theResults;
    if(currentIndex == count){

        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers}/${count}`
        }else if(rightAnswers === count ) {
            theResults = `<span class="perfect">Perfect</span>, ${rightAnswers}/${count}`
        }
        else {
            theResults = `<span class="bad">bad</span>, ${rightAnswers}/${count}`
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = `10px`;
        resultsContainer.style.backgroundColor = `white`;
        resultsContainer.style.marginTop = `10px`;
    }
}
function countdown(duration, count) {
    if(currentIndex < count){
        let minutes,seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10? `0${minutes}` : minutes;
            seconds = seconds < 10? `0${seconds}`: seconds;
            
            countdownElemnt.innerHTML = `${minutes}:${seconds}`;
           
            if(--duration < 0){
                clearInterval(countdownInterval)
                submitButton.click();
                
            }     
        }, 1000);
    }
}