const { Markup } = require("telegraf");

function toneKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "💼 Professional",
        "tone_professional"
      ),
    ],
    [
      Markup.button.callback(
        "❤️ Romantic",
        "tone_romantic"
      ),
    ],
    [
      Markup.button.callback(
        "😂 Funny",
        "tone_funny"
      ),
    ],
    [
      Markup.button.callback(
        "🤝 Soft",
        "tone_soft"
      ),
    ],
    [
      Markup.button.callback(
        "😎 Confident",
        "tone_confident"
      ),
    ],
  ]);
}

module.exports = toneKeyboard;