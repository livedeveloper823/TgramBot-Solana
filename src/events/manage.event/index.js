const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const {findInit} = require('@/controllers/initial.controllers');
const { findWallet } = require('@/controllers/wallet.controller');
const { findSettings } = require('@/controllers/settings.controller');
const { getTradesData } = require('@/controllers/trade.controller');
const {
  getTokenAccountByIndex,
  getTokenAccountByMint,
} = require('@/features/token.feature');
const { getTrade } = require('@/features/trade.feature');
const { getBalance } = require('@/services/solana');
const { clearAllInterval } = require('@/store');
const { positionMessage, noOpenPositionsMessage } = require('./messages');
const { positionKeyboard, noOpenPositionsKeyboard } = require('./keyboards');
const TonWeb = require('tonweb');
const {getPrice,getOutamount0,MetaData}=require('@/services/TonScan')
const {fet}=require('@/services/tonapi')
const tonweb= new TonWeb()
const TimeInterval = 30 * 1000;


const managePositions = async (bot, msg, params) => {
  await managePositionsInterval(bot, msg, params);

  // clearAllInterval();

  // const id = setInterval(async () => {
  //   await managePositionsInterval(bot, msg, { ...params, refresh: true });
  // }, TimeInterval)

  // setIntervalID({
  //   start: null,
  //   managePostition: id,
  //   token: null,
  // })
};

const managePositionsInterval = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { index, refresh } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const { message, keyboard } = await managePositionsInterval.getMessage({
    userId: chatId,
    wallet,
    settings,
    index,
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

managePositionsInterval.getMessage = async ({ userId, wallet, settings, index }) => {
  const walletAddress = wallet.address;
  const address = wallet.address;

  const walletBalance = await tonweb.getBalance(walletAddress);

  const {tokenAccount} = await getTokenAccountByIndex(address, index);
  console.log(tokenAccount)
  if (tokenAccount === null) {
    return {
      message: noOpenPositionsMessage(),
      keyboard: noOpenPositionsKeyboard(),
    };
  }

  const {tokenAddress } = tokenAccount;
  const data=await fet(tokenAddress)
    console.log(data)
    const baddress=data.bounceable.b64url
    pool= await getPrice(tokenAddress,"EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez")
    const {initial, baseAmount, quoteAmount}=await getTradesData(userId,baddress)
    console.log(tokenAddress)

    
    
    
    let metadata=await MetaData(baddress)
    const quoteAmounts=await getOutamount0(baddress,"EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez",quoteAmount)
    profitTon=(quoteAmounts.price -baseAmount)/1e9
    tokenAccount.profit=profitTon
    const divisor = Math.pow(10, tokenAccount.dec);
    tokenAccount.mcap=metadata.fdv_usd
    tokenAccount.priceUsd=metadata.price_usd
    tokenAccount.fdv_usd==metadata.fdv_usd
    tokenAccount.balance=tokenAccount.balance/divisor
    const worth=await getOutamount0(tokenAddress,"EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez",tokenAccount.balance*divisor)
    console.log(worth)
  
    
    tokenAccount.pool=pool.pool
    tokenAccount.mint=tokenAccount.symbol
    tokenAccount.initial=findInit(userId.toString(),baddress)/1e9
    tokenAccount.Address=metadata.address
    tokenAccount.worth=worth.price/1e9
  return {
    message: positionMessage({
      tokenAccount,
  
      walletBalance,
    }),
    keyboard: positionKeyboard({
      tokenAccount,
      index,
      settings,
    }),
  };
};

const showPositionAfterTrade = async (bot, msg, params,chatId) => {
  if(msg!=0&&msg!=1){chatId=msg.chat.id}
  else{chatId=chatId}
  
  const { mint, tradeAmount } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const { message, keyboard } = await showPositionAfterTrade.getMessage({
    userId: chatId,
    wallet,
    settings,
    mint,
    tradeAmount,
  });

  if (message === null && keyboard === null) {
    return;
  }

  bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};

showPositionAfterTrade.getMessage = async ({
  userId,
  wallet,
  settings,
  mint,
  tradeAmount,
}) => {
  const walletAddress = wallet.publicKey;
  const walletBalance = await getBalance(walletAddress);

  const tokenAccount = await getTokenAccountByMint(
    walletAddress,
    mint,
    tradeAmount
  );

  if (tokenAccount.balance === 0) {
    return {
      message: null,
      keyboard: null,
    };
  }

  const trade = await getTrade({
    userId,
    mint: tokenAccount.mint,
    decimals: tokenAccount.decimals,
    priceNative: tokenAccount.priceNative,
  });

  const index = tokenAccount.index;
  tokenAccount.index = undefined;

  return {
    message: positionMessage({
      tokenAccount,
      trade,
      walletBalance,
    }),
    keyboard: positionKeyboard({
      tokenAccount,
      index,
      settings,
    }),
  };
};

module.exports = {
  managePositions,
  showPositionAfterTrade,
};
