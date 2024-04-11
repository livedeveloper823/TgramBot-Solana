const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { findWallet } = require('@/controllers/wallet.controller');
const { WalletNotFoundError } = require('@/errors/common');
const { transferLamports } = require('@/features/transfer.feature');

const { getHttpEndpoint } =  require("@orbs-network/ton-access");
const TonWeb = require('tonweb');
const {getPrice,getOutamount0}=require('@/services/TonScan')
const tonweb= new TonWeb()
const {
  replyAmountMsg,
  replyAddressMsg,
  invalidNumberMsg,
  transactionInitiateMsg,
  transactionBuildFailedMsg,
  transactionSentMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,
} = require('./messages');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));}
  function isValidAddress(address) {
    // Check if the address is a string and has exactly 48 characters
    return typeof address === 'string' && address.length === 48;
}
const withdrawX = async (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const balance = await tonweb.getBalance(wallet.publicKey);

  bot
    .sendMessage(chatId, replyAmountMsg(balance), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, (reply) => {
        replyAmount(bot, reply, balance);
      });
    });
};

const withdrawAll = async (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const amount =  await tonweb.getBalance(wallet.address);
  replyAddress(bot, msg, amount);
};

const replyAmount = async (bot, msg, balance) => {
  const chatId = msg.chat.id;
  const amount = parseFloat(msg.text);

  if (isNaN(amount) || amount < 0 || amount > balance) {
    bot
      .sendMessage(chatId, invalidNumberMsg({ text: amount, balance }), {
        reply_markup: { force_reply: true },
      })
      .then(({ message_id }) => {
        bot.onReplyToMessage(chatId, message_id, (reply) => {
          replyAmount(bot, reply, balance);
        });
      });
  } else {
    replyAddress(bot, msg, amount);
  }
};

const replyAddress = async (bot, msg, amount) => {
  const chatId = msg.chat.id;

  bot
    .sendMessage(chatId, replyAddressMsg(), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        withdraw(bot, msg, {
          toPubkey: reply.text,
          amount: amount ,
        });
      });
    });
};

const withdraw = (bot, msg, { toPubkey, amount }) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  bot
    .sendMessage(chatId, transactionInitiateMsg())
    .then(async ({ message_id }) => {
      const endpoint = await getHttpEndpoint();
    console.log(1)
    const provider = new TonWeb.HttpProvider(endpoint);
    const WalletClass = tonweb.wallet.all.v3R2; // or another wallet class depending on your needs
    console.log(1)
    const payer = new WalletClass(provider, {publicKey: TonWeb.utils.hexToBytes(wallet.publicKey)});

      let txid;
      const address = await payer.getAddress();
      const lastTx = (await tonweb.getTransactions(address, 1))[0]
      if (!isValidAddress(toPubkey)){
        bot.sendMessage(chatId,`❌Address (${toPubkey}) not valid`)
        return
      }
      
        txid = await transferLamports(
          wallet,
          toPubkey,
          amount
        );try{
        if (txid.response=="no"){bot.sendMessage(chatId,`insufiscient balance fees for transfer are ${txid.fees/1e9} TON`);
         return}
        else if (txid=="no"){bot.sendMessage(chatId,`inccorect address`)}
        while (txHash == lastTxHash) {
          await sleep(8000) // some delay between API calls
          try{let tx = (await tonweb.getTransactions(address, 1))[0]
          txHash = tx.transaction_id.hash
        console.log(txHash)}catch{}}}catch{ }
        


      try {
        if (txid=="no"){bot.sendMessage(chatId,"insufiscient balance fees for transfer are 0.09 TON")}
        else{bot.editMessageText(transactionConfirmedMsg(txHash), {
          chat_id: chatId,
          message_id,
          disable_web_page_preview: true,
          parse_mode: 'HTML',
        });}
      } catch (error) {
        bot.editMessageText(transactionFailedMsg(error), {
          chat_id: chatId,
          message_id,
          disable_web_page_preview: true,
          parse_mode: 'HTML',
        });
      }
    });
};

module.exports = {
  withdrawX,
  withdrawAll,
};
