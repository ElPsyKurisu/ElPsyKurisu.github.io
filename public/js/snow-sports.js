// This ensures we don't run the code until the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the generate button exists on this page before running any code
    const generateBtn = document.getElementById('generate-memory-btn');
    if (!generateBtn) {
        // If the button isn't on the page, do nothing.
        return;
    }

    const display = document.getElementById('memory-display');
    const modal = document.getElementById('sensitive-modal');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const errorMessage = document.getElementById('error-message');

    let selectedMemory;

    generateBtn.addEventListener('click', async () => {
        // Fetch the public memories data. The path is relative to the HTML file.
        const response = await fetch('../memories.json');
        const memories = await response.json();
        selectedMemory = memories[Math.floor(Math.random() * memories.length)];

        // Reset the display and modal
        display.innerHTML = '';
        modal.style.display = 'none';
        errorMessage.textContent = '';

        if (selectedMemory.isSensitive) {
            questionText.textContent = selectedMemory.question;
            answerInput.value = '';
            modal.style.display = 'block';
        } else {
            showMemory(selectedMemory);
        }
    });

    submitAnswerBtn.addEventListener('click', async () => {
        const userAnswer = answerInput.value;
        if (!userAnswer) return;

        const response = await fetch('/api/check-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedMemory.id, answer: userAnswer }),
        });

        const result = await response.json();

        if (result.correct) {
            modal.style.display = 'none';
            showMemory(selectedMemory);
        } else {
            errorMessage.textContent = 'Sorry, that is not correct.';
        }
    });

    // =======================================================
    // == UPDATED FUNCTION TO HANDLE IMAGES AND VIDEOS ==
    // =======================================================
    function showMemory(memory) {
        if (memory.type === 'image') {
            display.innerHTML = `<img src="${memory.url}" alt="A snow memory" style="max-width: 500px;">`;
        } else if (memory.type === 'video') {
            // Important attributes for a looping video:
            // autoplay: Starts playing automatically.
            // loop: Repeats the video.
            // muted: Required by most modern browsers for autoplay to work.
            // playsinline: Good practice for mobile to prevent automatic fullscreen.
            // controls: Allows the user to pause, etc.
            display.innerHTML = `
                <video 
                    src="${memory.url}" 
                    style="max-width: 500px;" 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                    controls>
                    Your browser does not support the video tag.
                </video>
            `;
        }
    }
});