const { trim } = require('@/utils');

const description = () => `
🐶 Welcome to Ton Sniper

🚀 TON’s fastest bot to trade any coin (SPL token), and Ton Sniper official Telegram Sniper Bot.

🤌 Blazingly-fast trading at your fingertips. Use /start to open the main menu and start using all our features - fast swaps, new token alerts, trade tracking and PNL.
`;

const shortDescription = () => `

`;

module.exports = {
  description: () => trim(description()),
  shortDescription: () => trim(shortDescription()),
};
