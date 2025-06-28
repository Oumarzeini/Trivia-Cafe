import { allQuestions } from "./questions.js";

// Handle Menu toggling

 const showMenu = () => {
   const menuIcon = document.getElementById("menu_icon");
   const menuContainer = document.getElementById("menu_container");

   menuIcon.addEventListener("click", () => {
    menuContainer.classList.toggle("open");
    menuIcon.classList.toggle("fa-xmark")
   })
}

showMenu();

// Handle Timer
const displayTime = document.querySelector("#time_counter");
let timer;
let secondsEllapsed = 0;
const formatTime = (seconds) => {
    const mins = String(Math.floor( seconds / 60)).padStart(2,"0");
    const secs = String(seconds % 60).padStart(2,"0");
    return `${mins} : ${secs}`
}

function updateDisplay() {
    displayTime.textContent = "Time Spent " + formatTime(secondsEllapsed);
}

// Handle Questions
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
       [ array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const currentRoundQuestions = shuffle([...allQuestions]).slice(0,5);

let currentQuestionsIndex = 0;
let trackQuestionNumber = 1;
let score = 0;

const initializeTimer = () => {
    timer = setInterval(()=> {
            secondsEllapsed++;
            updateDisplay();
        }, 1000);
}

initializeTimer();


const displayNextQuestion = () => {
    if (currentQuestionsIndex < currentRoundQuestions.length) {
        const question = currentRoundQuestions[currentQuestionsIndex];

        
        const questionText = document.getElementById("questionText");
        const questionsContainer = document.getElementById("questionsContainer");
        const feedback = document.getElementById("feedback");
        console.log(questionText);
        const questionsCounter = document.getElementById("questionsCounter");
        const displayScore = document.getElementById("displayScore");

        questionsCounter.textContent = `Question ${trackQuestionNumber} of 5`;
        displayScore.textContent = `Score : ${score}`;
        questionText.textContent = question.inquiry;
        questionsContainer.innerHTML = "";
        feedback.textContent = "";

        question.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("options");
            button.onclick = () => {
                if (option === question.answer) {
                    feedback.textContent = "Excellent job! ✅";
                    feedback.style.color = "green";
                    button.style.backgroundColor= "lightgreen";
                    score++;
                }else {
                    feedback.textContent = "Try Again ❌";
                    feedback.style.color = "red";
                    button.style.backgroundColor = "salmon";
                }

                document.querySelectorAll(".options").forEach(btn => btn.disabled = true);

                setTimeout(()=> {
                    currentQuestionsIndex++;
                    trackQuestionNumber++;
                    displayNextQuestion();
                },1000) 
            };

            questionsContainer.appendChild(button)
        });

        
        

    } else {
        clearInterval(timer);
        feedback.textContent = "";
        showScore();
        
    }
}

displayNextQuestion();



const resetGame = () => {
    score = 0;
    currentQuestionsIndex= 0;
    trackQuestionNumber = 1;
    secondsEllapsed = 0;
    initializeTimer();

    const newQuestions = shuffle([...allQuestions]).slice(0,5);
    currentRoundQuestions.length = 0;
    currentRoundQuestions.push(...newQuestions);

    const finalScoreBox = document.querySelector(".finalScore_box");

    finalScoreBox.innerHTML = "";
    finalScoreBox.classList.remove("block");

    document.querySelector(".game_box").classList.remove("none");

    const timeAndScoreContainer = document.querySelector(".score_Time_container");
    timeAndScoreContainer.style.visibility = "visible";

    displayNextQuestion();
}

const showScore = ()=> {
    document.querySelector(".game_box").classList.add("none");

    const timeAndScoreContainer = document.querySelector(".score_Time_container");
    timeAndScoreContainer.style.visibility = "hidden";

    const finalScoreBox = document.querySelector(".finalScore_box");

    finalScoreBox.classList.add("block");


    const finalScoreHeader = document.createElement("h3");
    finalScoreHeader.classList.add("finalScoreHeader");
    finalScoreHeader.innerHTML = `Game Over ! Your Score : 
    <p> ${score} / 5 </p>`;
    
    

    // creating the button 

    const playAgainBtn = document.createElement("button");

    playAgainBtn.classList.add("playAgainBtn");
    playAgainBtn.onclick = () => {
        resetGame();
    };
    playAgainBtn.textContent = "Play Again";

    // creating the time displayer

    const timeSpent = document.createElement("p");
    timeSpent.innerHTML = `Time Spent : ${formatTime(secondsEllapsed)}`;
    timeSpent.classList.add("finalScoreHeader");


    finalScoreBox.appendChild(finalScoreHeader);
    finalScoreBox.appendChild(timeSpent);
    finalScoreBox.appendChild(playAgainBtn)
}

