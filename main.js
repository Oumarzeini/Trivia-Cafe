import { triviaQuestions, allQuestions } from "./questions.js";

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

let currentRoundQuestions = shuffle([...allQuestions]).slice(0,5);
let currentCategory = "all";
let currentLevel = "beginner";
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

// Handle the Category

    const allQuestionsCategory = document.getElementById("all");
    const scienceQuestionsCategory = document.getElementById("science");
    const historyQuestionsCategory = document.getElementById("history");
    const footballQuestionsCategory = document.getElementById("football");



    allQuestionsCategory.addEventListener("click", (el) => {
        setCategoryQuestions("all");
        el.target.classList.add("selected");
        scienceQuestionsCategory.classList.remove("selected");
        historyQuestionsCategory.classList.remove("selected");
        footballQuestionsCategory.classList.remove("selected")
    });
    scienceQuestionsCategory.addEventListener("click", (el) => {
        setCategoryQuestions("science");
        el.target.classList.add("selected");
        allQuestionsCategory.classList.remove("selected");
        historyQuestionsCategory.classList.remove("selected");
        footballQuestionsCategory.classList.remove("selected")
        });
    historyQuestionsCategory.addEventListener("click", (el) => {
        setCategoryQuestions("history");
        el.target.classList.add("selected");
        scienceQuestionsCategory.classList.remove("selected");
        allQuestionsCategory.classList.remove("selected");
        footballQuestionsCategory.classList.remove("selected")
        });
    footballQuestionsCategory.addEventListener("click", (el) => {
        setCategoryQuestions("football");
        el.target.classList.add("selected");
        scienceQuestionsCategory.classList.remove("selected");
        historyQuestionsCategory.classList.remove("selected");
        allQuestionsCategory.classList.remove("selected")
        });

// Handle Level 

const beginnerLevel = document.getElementById("beginnerLevel");
const interLevel = document.getElementById("interLevel");
const advancedLevel = document.getElementById("advancedLevel");

beginnerLevel.addEventListener("click", (el) => {
    setCategoryQuestions(currentCategory, "beginner");
    el.target.classList.add("selected")
    interLevel.classList.remove("selected")
    advancedLevel.classList.remove("selected")
})
interLevel.addEventListener("click", (el) => {
    setCategoryQuestions(currentCategory, "intermediate");
    el.target.classList.add("selected")
    beginnerLevel.classList.remove("selected")
    advancedLevel.classList.remove("selected")
})
advancedLevel.addEventListener("click", (el) => {
    setCategoryQuestions(currentCategory, "advanced");
    el.target.classList.add("selected")
    beginnerLevel.classList.remove("selected")
    interLevel.classList.remove("selected")
})




const setCategoryQuestions = (category, level = "beginner") => {
    currentCategory = category;
    currentLevel = level;


    if (category === "all"){
        currentRoundQuestions = shuffle([...allQuestions]).slice(0,5);
    } else {
        let selectedCategory = triviaQuestions[category][level];
        currentRoundQuestions = shuffle([...selectedCategory]).slice(0,5);
    }

    score = 0;
    currentQuestionsIndex = 0;
    trackQuestionNumber = 1;
    clearInterval(timer);
    secondsEllapsed = 0;
    initializeTimer();
    displayNextQuestion();
}
    

 


const displayNextQuestion = () => {


    if (currentQuestionsIndex < currentRoundQuestions.length) {
        const question = currentRoundQuestions[currentQuestionsIndex];

        
        const questionText = document.getElementById("questionText");
        const questionsContainer = document.getElementById("questionsContainer");
        const feedback = document.getElementById("feedback");
        
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

    let newQuestions ;
    if (currentCategory === "all") {
        newQuestions = shuffle([...allQuestions]).slice(0,5);
    }else {
        newQuestions = shuffle([...triviaQuestions[currentCategory][currentLevel]]);
    }

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

