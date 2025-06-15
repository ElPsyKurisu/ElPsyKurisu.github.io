// js/snow-sports.js - Final Version with "One Try" Logic

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
    let selectedQuestion;

    generateBtn.addEventListener('click', async () => {
        // Based on your structure, the fetch path is relative to the HTML file
        const memResponse = await fetch('../snowmemories.json');
        const memories = await memResponse.json();
        selectedMemory = memories[Math.floor(Math.random() * memories.length)];

        display.innerHTML = '';
        modal.style.display = 'none';
        errorMessage.textContent = '';

        if (selectedMemory.isSensitive) {
            const qResponse = await fetch('../questions.json');
            const questions = await qResponse.json();
            
            selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

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
            // This part stays the same for a correct answer
            modal.style.display = 'none';
            showMemory(selectedMemory);
        } else {
            // =======================================================
            // == NEW LOGIC FOR AN INCORRECT ANSWER ==
            // =======================================================
            // 1. Alert the user that they were incorrect.
            alert('Sorry, that was not correct. Please try generating a new memory.');
            // 2. Hide the modal to end their turn.
            modal.style.display = 'none';
            // =======================================================
            // == END OF NEW LOGIC ==
            // =======================================================
        }
    });

    function showMemory(memory) {
        if (memory.type === 'image') {
            display.innerHTML = `<img src="${memory.url}" alt="A snow memory" style="max-width: 500px;">`;
        } else if (memory.type === 'video') {
            display.innerHTML = `<video src="${memory.url}" style="max-width: 500px;" autoplay loop muted playsinline controls>Your browser does not support the video tag.</video>`;
        }
    }
});