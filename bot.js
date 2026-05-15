require("dotenv").config();

const { Telegraf } = require("telegraf");

const {
  rewriteText,
  generateExcuse,
  generateSorry,
} = require("./services/openai");

const toneKeyboard = require(
  "./keyboards/toneKeyboard"
);

const mainMenu = require(
  "./keyboards/mainMenu"
);

const userStates = require(
  "./state/userState"
);

const bot = new Telegraf(
  process.env.BOT_TOKEN
);

bot.start((ctx) => {
  ctx.reply(
    "👋 Welcome to SmoothTalk AI",
    mainMenu()
  );
});

// REWRITE
bot.hears("✍ Rewrite Text", (ctx) => {

  const telegramId = String(ctx.from.id);

  userStates[telegramId] = {
    mode: "rewrite",
  };

  ctx.reply(
    "Send the text you want rewritten."
  );
});

// EXCUSE
bot.hears("🧠 Generate Excuse", (ctx) => {

  const telegramId = String(ctx.from.id);

  userStates[telegramId] = {
    mode: "excuse",
    step: "who",
  };

  ctx.reply("Who is it for?");
});

// SORRY
bot.hears("🙏 Sorry", (ctx) => {

  const telegramId = String(ctx.from.id);

  userStates[telegramId] = {
    mode: "sorry",
    step: "who",
  };

  ctx.reply("Who is it for?");
});

// TEXT HANDLER
bot.on("text", async (ctx) => {

  const telegramId = String(ctx.from.id);

  const text = ctx.message.text;

  const state = userStates[telegramId];

  // IGNORE MENU BUTTONS
  if (
    text === "✍ Rewrite Text" ||
    text === "🧠 Generate Excuse" ||
    text === "🙏 Sorry"
  ) {
    return;
  }

  // EXCUSE FLOW
  if (state?.mode === "excuse") {

    if (state.step === "who") {

      state.who = text;

      state.step = "situation";

      return ctx.reply(
        "What's the situation?"
      );
    }

    if (state.step === "situation") {

      state.situation = text;

      return ctx.reply(
        "Choose tone:",
        toneKeyboard()
      );
    }
  }

  // SORRY FLOW
  if (state?.mode === "sorry") {

    if (state.step === "who") {

      state.who = text;

      state.step = "reason";

      return ctx.reply(
        "What are you apologizing for?"
      );
    }

    if (state.step === "reason") {

      state.reason = text;

      return ctx.reply(
        "Choose tone:",
        toneKeyboard()
      );
    }
  }

  // REWRITE FLOW
  if (state?.mode === "rewrite") {

    state.text = text;

    return ctx.reply(
      "Choose tone:",
      toneKeyboard()
    );
  }
});

// TONE HANDLER
bot.action(/tone_(.+)/, async (ctx) => {

  const telegramId = String(ctx.from.id);

  const tone = ctx.match[1];

  const state = userStates[telegramId];

  if (!state) {
    return ctx.reply(
      "Send a message first."
    );
  }

  await ctx.reply(
    "✨ Generating..."
  );

  try {

    // EXCUSE
    if (state.mode === "excuse") {

      const result =
        await generateExcuse(
          state.who,
          state.situation,
          tone
        );

      await ctx.reply(result);

      delete userStates[telegramId];

      return;
    }

    // SORRY
    if (state.mode === "sorry") {

      const result =
        await generateSorry(
          state.who,
          state.reason,
          tone
        );

      await ctx.reply(result);

      delete userStates[telegramId];

      return;
    }

    // REWRITE
    const rewritten =
      await rewriteText(
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


console.log("Bot running...");
module.exports = bot;