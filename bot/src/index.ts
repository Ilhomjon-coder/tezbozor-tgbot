import 'dotenv/config';
import { Bot, InlineKeyboard } from 'grammy';
import { botTexts } from './texts';

// Phase 0 bot: replies to /start with a greeting + a button that opens the
// Mini App. Order-status notifications, deep links and BullMQ jobs come in
// Phase 4 (see ROADMAP).
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is required (see bot/.env.example)');
}

// Must be an https URL for Telegram to accept a WebApp button (use a tunnel in dev).
const miniAppUrl = process.env.MINIAPP_URL;

const bot = new Bot(token);

bot.command('start', async (ctx) => {
  if (miniAppUrl) {
    const keyboard = new InlineKeyboard().webApp(botTexts.start.button, miniAppUrl);
    await ctx.reply(botTexts.start.greeting, { reply_markup: keyboard });
  } else {
    // No tunnel configured yet — still greet, but skip the (invalid) button.
    await ctx.reply(`${botTexts.start.greeting}\n\n${botTexts.start.noAppConfigured}`);
  }
});

bot.catch((err) => {
  console.error('Bot error', err);
});

async function main(): Promise<void> {
  console.log('Tezbozor bot starting…');
  await bot.start({
    onStart: (info) => console.log(`Bot @${info.username} is running`),
  });
}

void main();
