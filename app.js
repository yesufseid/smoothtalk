const express = require("express");
const app = express();
const bot = require("./bot");

const PORT = process.env.PORT || 3000;
bot.launch()
app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Bot running...");