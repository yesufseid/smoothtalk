const express = require("express");

const bot = require("./bot")
const app = express();
;

app.use(bot.webhookCallback("/bot"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);

  await bot.telegram.setWebhook(
    `${process.env.RENDER_EXTERNAL_URL}/bot`
  );

  console.log("Webhook set");
});