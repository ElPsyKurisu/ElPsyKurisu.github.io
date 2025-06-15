document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-memory-btn');
    if (!generateBtn) return;

    // Get all the other necessary elements...
    const display = document.getElementById('memory-display');
    const modal = document.getElementById('sensitive-modal');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const errorMessage = document.getElementById('error-message');

    let selectedMemory;
    let selectedQuestion; // Variable to store the randomly chosen question

    generateBtn.addEventListener('click', async () => {
        const memResponse = await fetch('../question_system/snowmemories.json');
        const memories = await memResponse.json();
        selectedMemory = memories[Math.floor(Math.random() * memories.length)];

        display.innerHTML = '';
        modal.style.display = 'none';
        errorMessage.textContent = '';

        if (selectedMemory.isSensitive) {
            // Fetch the entire bank of questions
            const qResponse = await fetch('../question_system/questions.json');
            const questions = await qResponse.json();
            
            // Pick one random question from the bank
            selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

            // Display the randomly chosen question
            questionText.textContent = selectedQuestion;
            answerInput.value = '';
            modal.style.display = 'block';
        } else {
            showMemory(selectedMemory);
        }
    });

    submitAnswerBtn.addEventListener('click', async () => {
        const userAnswer = answerInput.value;
        if (!userAnswer || !selectedQuestion) return;

        // Send BOTH the question and the user's answer to the API
        const response = await fetch('/api/check-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: selectedQuestion,
                userAnswer: userAnswer
            }),
        });

        const result = await response.json();

        if (result.correct) {
            modal.style.display = 'none';
            showMemory(selectedMemory);
        } else {
            errorMessage.textContent = 'Sorry, that is not correct.';
            modal.style.display = 'none';
        }
    });

    function showMemory(memory) {
        // ... same showMemory function as before ...
        if (memory.type === 'image') {
            display.innerHTML = `<img src="${memory.url}" alt="A snow memory" style="max-width: 500px;">`;
        } else if (memory.type === 'video') {
            display.innerHTML = `<video src="${memory.url}" style="max-width: 500px;" autoplay loop muted playsinline controls>Your browser does not support the video tag.</video>`;
        }
    }
});