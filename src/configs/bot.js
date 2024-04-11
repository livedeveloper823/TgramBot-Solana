const TelegramBot = require("node-telegram-bot-api");
const commands = require("@/constants/commands");
const { description, shortDescription } = require("@/constants/descriptions");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const channelId = 'YOUR_CHANNEL_ID';

// Listen to messages in the specified channel
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (chatId == channelId) {
        console.log(`Received message in channel ${channelId}:`, msg.text);
        // You can add your logic to handle the received message here
    }
});

console.log('Bot is now listening to messages in the channel...');

// Handle errors
bot.on('polling_error', (error) => {
    
});
bot.setMyCommands(commands);
bot.setMyDescription({ description: description() });
bot.setMyShortDescription({ short_description: shortDescription() });

module.exports = bot;
