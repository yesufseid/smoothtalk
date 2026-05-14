const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function rewriteText(text, tone) {
  const prompt = `
You are SmoothTalk AI.

Rewrite this message.

Tone:
${tone}

Rules:
- natural
- emotionally intelligent
- short
- human
- polished

Message:
${text}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error(error);
    return "Something went wrong.";
  }
}

async function generateExcuse(who, situation, tone) {
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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You help users write socially smart messages.

${prompt}
`,
      config: {
        temperature: 0.9,
      },
    });

    return response.text;

  } catch (error) {
    console.error(error);
    return "Something went wrong.";
  }
}
async function generateSorry(
   who,
  reason,
  tone
) {

  const prompt = `
Write a sincere apology message and try to give short answear as possible.
Who is it for:
${who}

Reason:
${reason}

Tone:
${tone}

Rules:
- natural
- emotionally intelligent
- human
- believable
- short
- sincere
`;

  try {

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
You help users write thoughtful apology messages.

${prompt}
`,

        config: {
          temperature: 0.9,
        },
      });

    return response.text;

  } catch (error) {

    console.error(error);

    return "Something went wrong.";
  }
}
module.exports = {
  rewriteText,
  generateExcuse,
  generateSorry
};