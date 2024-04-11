const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { findSettings } = require('@/controllers/settings.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const { swap } = require('@/events/swap.event');
const { getBalance } = require('@/services/solana');
const { replyAmountMsg, invalidAmountMsg } = require('./messages');
const TonWeb = require('tonweb');
const{fetchJettonBalances}=require("@/services/TonScan")

const tonweb=new TonWeb() 
const buyX = async (bot, msg, params,p) => {
  const chatId = msg.chat.id; 
  const { mintAddress } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const walletBalance = await tonweb.getBalance(wallet.address);
  console.log("here")

  bot
    .sendMessage(chatId, replyAmountMsg(walletBalance), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const amount = parseFloat(reply.text);
        if (isNaN(amount) || amount < 0 || amount > walletBalance) {
          bot.sendMessage(chatId, invalidAmountMsg());
          return;
        }
        buyAmount(bot, msg, {
          mintAddress,
          amount,
        },p);
      });
    });
};

const buyAmount = async (bot, msg, params,p) => {
  chatId=msg.chat.id
  const { mintAddress, amount, isAuto } = params;
  if(p=p){
    const wallet = findWallet(chatId);
  const data = await fetchJettonBalances(wallet.address);
  const filteredData = data.filter(item => item.symbol === mintAddress);
  swap(bot, msg, {
    inputMint: 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez',
    outputMint: filteredData[0].tokenAddress,
    amount: amount * 1000000000,
   
    mode: 'buy',
    isAuto,
  });
  }
 else{
 
  console.log(amount)
  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
  

    swap(bot, msg, {
      inputMint: 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez',
      outputMint: mintAddress,
      amount: amount * 1000000000,
      
      mode: 'buy',
      isAuto,
    });};}


module.exports = {
  buyX,
  buyAmount,
};
