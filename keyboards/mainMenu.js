const { Markup } = require("telegraf");

function mainMenu() {
  return Markup.keyboard([
    [
      "✍ Rewrite Text",
      "🧠 Generate Excuse",
    ],
    [
      "🙏 Sorry",
    ],
  ])
    .resize();
}

module.exports = mainMenu;