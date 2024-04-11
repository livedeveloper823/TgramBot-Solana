const web3 = require('@solana/web3.js')
const { getAccount } = require('@solana/spl-token');
const { findSettings } = require('@/controllers/settings.controller');
const{findWallet} = require('@/controllers/wallet.controller');

const { SettingsNotFoundError } = require('@/errors/common');
const { swap } = require('@/events/swap.event');
const{fetchJettonBalances}=require("@/services/TonScan")

// const { getAccount } = require('@/services/solscan');
const { replyAmountMsg, invalidAmountMsg } = require('./messages');

const sellX = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { ata } = params;

  bot
    .sendMessage(chatId, replyAmountMsg(), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const percent = parseFloat(reply.text);
        if (isNaN(percent) || percent < 0 || percent > 100) {
          bot.sendMessage(chatId, invalidAmountMsg());
          return;
        }
        sellPercent(bot, msg.chat.id, { ata, percent });
      });
    });
};

const sellPercent = async (bot, msg, params,add) => {
  const chatId = msg;
  
  const { ata, percent,} = params;
  console.log(ata)
  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
  const wallet = findWallet(chatId);
  const data = await fetchJettonBalances(wallet.address);
  console.log(wallet)
  console.log(data)
  const filteredData = data.filter(item => item.symbol === ata);
  console.log(filteredData)
  
 
    
console.log(filteredData[0].tokenAddress)
    swap(bot, 1, {
      inputMint: filteredData[0].tokenAddress,
      outputMint: 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez',
      amount: parseInt((filteredData[0].balance * percent)/100 ),
      slippage: settings.sellSlippage,
      mode: 'sell',
    },msg,0,percent/100);
  
};

module.exports = {
  sellX,
  sellPercent,
};
