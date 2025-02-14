// Chapters for each subject
const chapters = {
    maths: ['Fractions', 'Money', 'Measurement', 'Perimeter and Area', 'Time', 'Data Handling', 'Introduction to Decimals'],
    science: ['The Environment', 'Animals Living Surviving', 'Air, Water, Weather', 'The Solar System', 'Animal Reproduction', 'Teeth and Digestion'],
    social: ['Our Water Resources', 'Our Soil Resources', 'Our Forest & Wildlife', 'Our Rights & Duties', 'Our Human Resources', 'Our Mineral Resources', 'The Southern Plateaus'],
    computers: ['Scratch More Blocks Commands', 'Intro MS POwer Point 2016', 'Browsing the Internet', 'Power Point Working With Slides'],
    english: ['Adjectives', 'Adverbs', 'Pronouns', 'Homophones and Homonyms', 'Conjunctions', 'Prepositions'],
    hindi: ['हवा चली', 'मेहनत का फल', 'गुब्बारे की  आत्मकथा', 'हीरा  और कोयला','पयाावरण  प्रदूषण'],
    valueeducation: ['Success', 'Forgiveness', 'Celebrating Relations'],
    gk: ['Fastest Finger First', 'Flowering Beauties', 'Medicinal Plants', 'Match Them Up', 'Quiz Time', 'India in the Lead', 'Famous Musicians of India','Places Worth Seeing','Our Body and Us','Endangered Animals Of India','Sports Time','Sportspersons - Sobriquets and Achievements','Games Mania','Good Habits and Manners','Famous Indian Films and Directors'],
};

// Global variables for the quiz
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAttempts = 0; // Track total wrong attempts
let questions = [];
let questionAttempts = {}; // Track wrong attempts per question

// Function to populate chapters for each subject
function populateChapters() {
    for (const subject in chapters) {
        const chapterList = chapters[subject];
        const subjectElement = document.getElementById(`${subject}-chapters`);

        chapterList.forEach(chapter => {
            const listItem = document.createElement('li');
            listItem.textContent = chapter;
            listItem.addEventListener('click', () => loadQuestions(subject, chapter)); // Load questions on click
            subjectElement.appendChild(listItem);
        });
    }
}

// Load questions from the specific chapter's JSON file
const loadQuestions = (subject, chapter) => {
    fetch(`questions/${subject}/${chapter}.json`)
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data).slice(0, 20); // Shuffle and select 30 questions
            currentQuestionIndex = 0;
            correctAnswers = 0;
            wrongAttempts = 0;
            questionAttempts = {}; // Reset wrong attempts tracking
            showQuestion();
            document.querySelector('.chapter-container').style.display = 'none';
            document.querySelector('.question-container').style.display = 'block';
        })
        .catch(error => console.error('Error loading questions:', error));
};

// Shuffle an array (Fisher-Yates Shuffle)
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
    document.getElementById('question').textContent = `Question ${currentQuestionIndex + 1}: ${question.question}`;
    const choicesList = document.getElementById('choices');
    choicesList.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.addEventListener('click', () => checkAnswer(index));
        choicesList.appendChild(li);
    });

    document.getElementById('feedback').textContent = ''; // Clear previous feedback
    document.getElementById('next-btn').style.display = 'none'; // Hide "Next" button
};

// Check if the selected answer is correct
const checkAnswer = (selectedIndex) => {
    const question = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');

    if (!questionAttempts[currentQuestionIndex]) {
        questionAttempts[currentQuestionIndex] = 0; // Initialize tracking for this question
    }

    if (selectedIndex === question.correctAnswer) {
        correctAnswers++;
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
    } else {
        questionAttempts[currentQuestionIndex]++; // Increment wrong attempts
        wrongAttempts++;
        feedback.textContent = 'Incorrect!';
        feedback.style.color = 'red';
    }

    document.getElementById('next-btn').style.display = 'block'; // Show "Next" button
};

// Show the next question or end the quiz
const showNextQuestion = () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};

// Display the result after completing the quiz
const showResult = () => {
    const result = document.getElementById('result');
    result.innerHTML = `Quiz Complete!<br>Correct Answers: ${correctAnswers} / ${questions.length}<br>Wrong Attempts: ${wrongAttempts}`;
    result.style.display = 'block';
    document.querySelector('.question-container').style.display = 'none';
};

// "Next" button functionality
document.getElementById('next-btn').addEventListener('click', showNextQuestion);

// Call the function to populate the chapters when the page loads
document.addEventListener('DOMContentLoaded', populateChapters);
