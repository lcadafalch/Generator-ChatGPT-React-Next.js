import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { priceMin, priceMax, gender, age, hobbies } = req.body;
  const prompt = generatePrompt(priceMin, priceMax, gender, age, hobbies);
  console.log(prompt);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }



  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(priceMin, priceMax, gender, age, hobbies),
      temperature: 0.6,
      // max_tokens = parts of words
      max_tokens:2048

    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
// Inputs needed for the correct use of the program
function generatePrompt(priceMin, priceMax, gender, age, hobbies) {
  return `Suggest 3 Chrismas gift ideas between ${priceMin}$ and ${priceMax} for a ${age} years old ${gender} that is into ${hobbies}`;
}
