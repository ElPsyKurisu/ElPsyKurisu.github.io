/**
 * Vercel Serverless Function to securely check a user's answer.
 * This function is designed to work with a central question bank.
 */
export default function handler(req, res) {
  try {
    // 1. Securely access the secret JSON string from Vercel's Environment Variables.
    // This variable holds the mapping of all questions to their answers.
    const answersString = process.env.ANSWERS_JSON;

    // A safety check in case the environment variable is not set.
    if (!answersString) {
      throw new Error("ANSWERS_JSON environment variable not found.");
    }

    // 2. Parse the JSON string from the environment variable into a usable JavaScript object.
    const answers = JSON.parse(answersString);
    
    // 3. Get the specific question and the user's answer from the request sent by the frontend.
    const { question, userAnswer } = req.body;

    // 4. Look up the correct answer from our answers object using the question as the key.
    const correctAnswer = answers[question];

    // 5. Perform a case-insensitive comparison to see if the answers match.
    // The '&& correctAnswer' part ensures we don't get an error if the question isn't found.
    const isCorrect = correctAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase();

    // 6. Send a simple JSON response back to the frontend: { correct: true } or { correct: false }.
    res.status(200).json({ correct: isCorrect });

  } catch (error) {
    // If anything goes wrong (e.g., missing variable, bad JSON), log the error
    // on the server and send a generic error response to the user.
    console.error("Error in check-answer function:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}