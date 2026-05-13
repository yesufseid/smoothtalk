const { Markup } = require("telegraf");

function mainMenu() {
  return Markup.keyboard([
    ["✍ Rewrite Text"],
    ["🧠 Generate Excuse"],
    ["🌍 Translate + Improve"],
  ])
    .resize();
}

module.exports = mainMenu;