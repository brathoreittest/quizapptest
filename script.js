const subjects = {
    maths: [
        { name: "Fractions", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/Fractions.json" },
        { name: "Measurement", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/Measurement.json" },
        { name: "Perimeter and Area", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/PerimeterandArea.json" },
        { name: "Time", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/Time.json" }
    ],
    science: [
        { name: "Air, Water, Weather", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/AirWaterWeather.json" },
        { name: "The Solar System", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/TheSolarSystem.json" },
        { name: "Animal Reproduction", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/AnimalReproduction.json" }
    ],
    social: [
        { name: "Our Forest & Wildlife", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/OurForestAndWildlifeResources.json" },
        { name: "Our Rights & Duties", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/OurRightsAndDuties.json" }
    ],
    computers: [
        { name: "Data Handling", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/DataHandling.json" },
        { name: "Introduction to Decimals", url: "https://raw.githubusercontent.com/brathoreittest/quizapp/main/Introductiontodecimals.json" }
    ]
};

let allQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

function loadChapters(subject) {
    const chapterContainer = document.querySelector(".chapter-buttons");
    chapterContainer.innerHTML = "";
    subjects[subject].forEach(chapter => {
        const button = document.createElement("button");
        button.innerText = chapter.name;
        button.addEventListener("click", () => loadQuestions(chapter.url));
        chapterContainer.appendChild(button);
    });
}

async function loadQuestions(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load: ${url}`);
        
        allQuestions = await response.json();
        questions = getRandomQuestions(allQuestions, Math.min(30, allQuestions.length));
        
        currentQuestionIndex = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        document.querySelector(".question-container").style.display = "block";
        document.getElementById("result").innerHTML = "";
        
        showQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function getRandomQuestions(questionArray, numQuestions) {
    return questionArray.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
}

function showQuestion() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-btn");

    feedbackElement.innerText = "";
    choicesElement.innerHTML = "";
    nextButton.style.display = "none";

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    currentQuestion.choices.forEach((choice, index) => {
        const li = document.createElement("li");
        li.innerText = choice;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            if (index === currentQuestion.correctAnswer) {
                li.style.color = "green";
                feedbackElement.innerText = "Correct!";
                correctAnswers++;
            } else {
                li.style.color = "red";
                feedbackElement.innerText = "Incorrect!";
                wrongAnswers++;
            }
            nextButton.style.display = "block";
        });

        choicesElement.appendChild(li);
    });

    nextButton.onclick = nextQuestion;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const questionContainer = document.querySelector(".question-container");
    const resultElement = document.getElementById("result");

    questionContainer.style.display = "none";
    resultElement.innerHTML = `
        <p>Quiz completed!</p>
        <p style="color: green;font-size: 3em;">Correct Answers: ${correctAnswers}</p>
        <p style="color: red;font-size: 3em;">Wrong Answers: ${wrongAnswers}</p>
    `;
}
