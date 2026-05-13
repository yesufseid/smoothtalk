require("dotenv").config();

const { Telegraf,Markup } = require("telegraf");
const { rewriteText,generateExcuse } = require("./services/openai");
const toneKeyboard = require("./keyboards/toneKeyboard");
const mainMenu = require("./keyboards/mainMenu");

const userStates = require("./state/userState");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "👋 Welcome to SmoothTalk AI",
    mainMenu()
  );
});
bot.hears("✍ Rewrite Text", (ctx) => {
  ctx.reply(
    "Send the text you want rewritten."
  );
});

bot.hears("🧠 Generate Excuse", (ctx) => {
  const telegramId = String(ctx.from.id);

  userStates[telegramId] = {
    mode: "excuse",
    step: "who",
  };

  ctx.reply("Who is it for?");
});

// Save user message
bot.on("text", async (ctx) => {
  const telegramId = String(ctx.from.id);

  const text = ctx.message.text;

  const state = userStates[telegramId];

  // EXCUSE FLOW
  if (state?.mode === "excuse") {

    // STEP 1
    if (state.step === "who") {
      state.who = text;
      state.step = "situation";

      return ctx.reply(
        "What's the situation?"
      );
    }

    // STEP 2
    if (state.step === "situation") {
      state.situation = text;
      state.step = "tone";

      return ctx.reply(
        "Choose tone:",
        toneKeyboard()
      );
    }
  }

  // REWRITE FLOW
  userStates[telegramId] = {
    mode: "rewrite",
    text,
  };

  await ctx.reply(
    "Choose tone:",
    toneKeyboard()
  );
});

// Handle tone selection
bot.action(/tone_(.+)/, async (ctx) => {
  const telegramId = String(ctx.from.id);

  const tone = ctx.match[1];

  const state = userStates[telegramId];

  if (!state) {
    return ctx.reply("Send a message first.");
  }

  await ctx.reply("✨ Generating...");

  try {

    // EXCUSE MODE
    if (state.mode === "excuse") {
      const result = await generateExcuse(
        state.who,
        state.situation,
        tone
      );

      await ctx.reply(result);

      delete userStates[telegramId];

      return;
    }

    // REWRITE MODE
    const rewritten = await rewriteText(
      state.text,
      tone
    );

    await ctx.reply(rewritten);

    delete userStates[telegramId];

  } catch (error) {
    console.error(error);

    await ctx.reply(
      "Something went wrong."
    );
  }
});

bot.launch();

console.log("Bot running...");