// Chapters for each subject
const chapters = {
    maths: ['Fractions', 'Measurement', 'Perimeter and Area', 'Time', 'Data Handling', 'Introduction to Decimals'],
    science: ['Air, Water, Weather', 'The Solar System', 'Animal Reproduction'],
    social: ['Our Forest & Wildlife', 'Our Rights & Duties'],
    computers: ['Programming', 'Database', 'Networking', 'Web Development']
};

// Global variables for the quiz
let currentQuestionIndex = 0;
let correctAnswers = 0;
let questions = [];

// Function to populate chapters for each subject
function populateChapters() {
    // Iterate through each subject
    for (const subject in chapters) {
        const chapterList = chapters[subject];
        const subjectElement = document.getElementById(`${subject}-chapters`);
        
        // Create list items for each chapter in the subject
        chapterList.forEach(chapter => {
            const listItem = document.createElement('li');
            listItem.textContent = chapter;
            listItem.addEventListener('click', () => loadQuestions(subject, chapter));  // Add click event for chapter
            subjectElement.appendChild(listItem);
        });
    }
}

// Load questions from the specific chapter's JSON file
const loadQuestions = (subject, chapter) => {
    fetch(`questions/${subject}/${chapter}.json`)  // Load the appropriate JSON file
        .then(response => response.json())
        .then(data => {
            // Randomly shuffle questions and select 30
            questions = shuffleArray(data).slice(0, 30);
            currentQuestionIndex = 0;
            correctAnswers = 0;
            showQuestion();  // Display the first question
            document.querySelector('.chapter-container').style.display = 'none';  // Hide chapter selection
            document.querySelector('.question-container').style.display = 'block';  // Show question container
        })
        .catch(error => console.error('Error loading questions:', error));
};

// Function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Display the current question
const showQuestion = () => {
    const question = questions[currentQuestionIndex];
    // Add the question number
    document.getElementById('question').textContent = `Question ${currentQuestionIndex + 1}: ${question.question}`;
    const choicesList = document.getElementById('choices');
    choicesList.innerHTML = '';  // Clear previous choices

    // Add choices as clickable list items
    question.choices.forEach((choice, index) => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.addEventListener('click', () => checkAnswer(index));
        choicesList.appendChild(li);
    });
};

// Check if the selected answer is correct
const checkAnswer = (selectedIndex) => {
    const question = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    
    if (selectedIndex === question.correctAnswer) {
        correctAnswers++;
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = 'Incorrect!';
        feedback.style.color = 'red';
    }

    document.getElementById('next-btn').style.display = 'block';  // Show "Next" button
};

// Show the next question or end the quiz
const showNextQuestion = () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
        document.getElementById('next-btn').style.display = 'none';  // Hide "Next" button
        document.getElementById('feedback').textContent = '';  // Clear feedback
    } else {
        showResult();
    }
};

// Display the result after completing the quiz
const showResult = () => {
    const result = document.getElementById('result');
    result.innerHTML = `Quiz Complete!<br>Correct Answers: ${correctAnswers} / ${questions.length}`;
    result.style.display = 'block';  // Show result
    document.querySelector('.question-container').style.display = 'none';  // Hide question container
};

// "Next" button functionality
document.getElementById('next-btn').addEventListener('click', showNextQuestion);

// Call the function to populate the chapters when the page loads
document.addEventListener('DOMContentLoaded', populateChapters);
