const { LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const connection = require('@/configs/connection');

const { findSettings } = require('@/controllers/settings.controller');
const { findStrategy } = require('@/controllers/strategy.controller');
const { getTradesData,getTradesDataauto } = require('@/controllers/trade.controller');
const { findUser } = require('@/controllers/user.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const { prisma } = require('@/configs/database');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const { buyAmount } = require('@/events/buy.event');

const { sellPercent } = require('@/events/sell.event');
const { MetaData,getPrice } = require('@/services/TonScan');
const { getBalance } = require('@/services/solana');
const { getTokenMetadata } = require('@/services/metaplex');
const { getTokenAccountsByOwner } = require('@/features/token.feature');

const {
  buyTokenMsg,
  tokenMsg,
  tokenNotFoundMsg,
  noRouteMsg,
  autoBuyFailedMsg,
  copyWalletMsg,
  invalidInputMsg,
  invalidWalletAddressMsg,
  copyTradeMsg,
  tokenSniperSettingMsg,
} = require('./messages');
const { buyTokenKeyboard, tokenKeyboard } = require('./keyboards');
const TonWeb = require('tonweb');

const tonweb=new TonWeb()
const TimeInterval = 30 * 1000;

const buyToken = (bot, msg) => {
  const chatId = msg.chat.id;
  console.log("lol")
  bot.sendMessage(chatId, buyTokenMsg(), {
    parse_mode: 'HTML',
    reply_markup: {force_reply: true,
        
    },
}).then(sentMessage => {
    // Listen for the reply to the specific message
    bot.onReplyToMessage(chatId,sentMessage.message_id, async (reply) => {
        if (reply.text) {
            if (!reply.text.startsWith('/')) {
                processToken(bot, reply);
            }
        }
    });
});}

const processToken = async (bot, msg) => {
  const chatId = msg.chat.id;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
  console.log(settings.autoBuy)
  if (settings.autoBuy) {
    autoBuyToken(bot, msg, {
      mintAddress: msg.text,
      settings,
    });
  } else {
    showToken(bot, msg, {
      settings,
      mintAddress: msg.text,
      refresh: false,
    });
  }
};

const autoBuyToken = async (bot, msg, params) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const walletAddress = wallet.address;
  const { mintAddress, settings } = params;

  try {
    await MetaData(mintAddress);
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, tokenNotFoundMsg(mintAddress));
    return;
  }

  const walletBalance = await tonweb.getBalance(walletAddress);
  console.log(walletBalance)
  if (settings.autoBuyAmount > walletBalance) {
    bot.sendMessage(
      chatId,
      autoBuyFailedMsg({ amount: settings.autoBuyAmount, walletBalance })
    );
    return;
  }

  buyAmount(bot, msg, {
    mintAddress,
    amount: settings.autoBuyAmount,
    isAuto: true,
  });
};

const autoSellToken = async (bot, chatId) => {
  
  if (findUser(chatId) === null) {
    console.log('New User');
    return;
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
  
  if (!settings.autoSell || settings.autoSell == 0) {
    return;
  }

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const tokens = await getTokenAccountsByOwner(wallet.publicKey);

  if (tokens.length === 0) {
    
    return;
  }

  tokens.forEach(async (token) => {
    try {
      await getTokenMetadata(token.mint);
    } catch (e) {
      console.error(e);
      bot.sendMessage(chatId, tokenNotFoundMsg(token.mint));
      return;
    }

    const { mint, decimals, priceNative } = token;
    const { initials, baseAmounts, quoteAmounts } = await getTradesData(chatId, mint);

    const profitSols = (quoteAmounts / 10 ** decimals) * priceNative - baseAmounts / LAMPORTS_PER_SOL;
    let profitPercents = (profitSols * 100.0) / (initials / LAMPORTS_PER_SOL);
    console.log(`profits : ${profitPercents}%`)
    const strategies = await findStrategy(chatId);
    
    for (const strategy of strategies) {
      let { initial, baseAmount, quoteAmount, tradesss } = await getTradesDataauto(chatId, mint, strategy.id);
  
      const profitSol = (quoteAmount / 10 ** decimals) * priceNative - baseAmount / LAMPORTS_PER_SOL;
      const profitPercent = (profitSol * 100.0) / (initial / LAMPORTS_PER_SOL);
      
      if (profitPercent > 0 && strategy.percent > 0 && profitPercent >= strategy.percent) {
        for (const trade of tradesss) {
          await prisma.strategyTrade.create({
            data: {
              strategyId: strategy.id,
              tradeId: trade.id,
            },
          });
        }
        await new Promise((resolve, reject) => {
          sellPercent(bot, chatId, {
            tokenInfo: token,
            percent: strategy.amount,
            isAuto: true,
          }, { add: true, id:strategy.id}).then(() => resolve()).catch((error) => reject(error));
        });
        
      }
      if (profitPercent < 0 && strategy.percent < 0 && profitPercent <= strategy.percent) {
        for (const trade of tradesss) {
          await prisma.strategyTrade.create({
            data: {
              strategyId: strategy.id,
              tradeId: trade.id,
            },
          });
        }
        await new Promise((resolve, reject) => {
          sellPercent(bot, chatId, {
            tokenInfo: token,
            percent: strategy.amount,
            isAuto: true,
          }, { add: true, addresses: tradesss,id:strategy.id }).then(() => resolve()).catch((error) => reject(error));
        });
      }
    }
  });
};


const showToken = async (bot, msg, params) => {
  await showTokenInterval(bot, msg, params);

  // clearAllInterval();

  // const id = setInterval(async () => {
  //   await showTokenInterval(bot, msg, { ...params, refresh: true });
  // }, TimeInterval)

  // setIntervalID({
  //   start: null,
  //   managePostition: null,
  //   token: id,
  // })
};

const showTokenInterval = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { mintAddress, refresh } = params;

  const settings = params.settings || (await findSettings(chatId));
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const { message, keyboard } = await showTokenInterval.getMessage(bot,chatId,{
    walletAddress: wallet.address,
    mintAddress,
    settings,
  });

  if (refresh === false) {
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    bot
      .editMessageText(message, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard,
        },
      })
      .catch(() => { });
  }
}

showTokenInterval.getMessage = async (bot,chatId,{ walletAddress, mintAddress, settings }) => {
  
try{
  
  const metadata = await MetaData(mintAddress);
  const pool = await getPrice("EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez",mintAddress)
  
  

  
  const walletBalance = await tonweb.getBalance(walletAddress);
  console.log(metadata)

  
  return {
    message: tokenMsg({
      mint: mintAddress,
      priceUsd:metadata.price_usd,
      mcap:metadata.fdv_usd,
      name: metadata.name,
      symbol: metadata.symbol,
      price:pool.price,
      pool:pool.pool,
      vol:metadata.volume_usd.h24,
      total_reserve:metadata.total_reserve_in_usd,
      walletBalance,
    }),
    keyboard: tokenKeyboard({ mintAddress, settings }),
  };
}catch(e){
  console.log(e)
  return{message:"⛔ No token Found with that address",keyboard:[]}}}


const tokenSniper = (bot, msg) => {
  const chatId = msg.chat.id;
  let metadata;

  bot
    .sendMessage(chatId, tokenSniperSettingMsg(), {
      parse_mode: 'HTML',
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const sniperTokenMint = reply.text;

        try {
          metadata = await getTokenMetadata(sniperTokenMint);
        } catch (e) {
          console.error(e);
          bot.sendMessage(chatId, tokenNotFoundMsg(sniperTokenMint), {
            parse_mode: 'HTML',
          });
          return;
        }
      });
    })
}

module.exports = {
  buyToken,
  processToken,
  showToken,
  autoBuyToken,
  autoSellToken,

  tokenSniper,
};
