const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:process.env.OPENROUTER_API_KEY,
});
async function generateExcuse(
  who,
  situation,
  tone
) {

  const prompt = `
Generate a believable message.

Who is it for:
${who}

Situation:
${situation}

Tone:
${tone}

Rules:
- natural
- short
- human
- emotionally intelligent
- believable
- realistic
`;

  try {

    const apiResponse =
      await client.chat.completions.create({
        model:
          "meta-llama/llama-3.3-70b-instruct:free",

        messages: [
          {
            role: "system",
            content:
              "You help users write socially smart messages.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.9,
      });

    return apiResponse
      .choices[0]
      .message
      .content;

  } catch (error) {

    console.log(error);

    return "Something went wrong.";
  }
}