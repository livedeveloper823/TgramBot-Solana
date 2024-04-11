
const { createSettings, findSettings } = require('@/controllers/settings.controller');
const { getTradesData } = require('@/controllers/trade.controller');
const { createUser, findUser } = require('@/controllers/user.controller');
const { createWallet, findWallet } = require('@/controllers/wallet.controller');
const { WalletNotFoundError } = require('@/errors/common');
const {fet}=require('@/services/tonapi')
const {findInit} = require('@/controllers/initial.controllers');
const { welcomeMsg, positionsMsg } = require('./messages');
const { startKeyboard } = require('./keyboards');
const TonWeb = require('tonweb');
const{fetchJettonBalances,getPrice,getOutamount0,MetaData}=require("@/services/TonScan")

const TimeInterval = 30 * 1000;
const tonweb=new TonWeb()

const start = async (bot, msg, params) => {
  await startInterval(bot, msg, params);
  
 
};

const startInterval = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const { code, refresh } = params;
  console.log(findUser(chatId))
  if (findUser(chatId) === null) {
    await createUser(chatId, username, code);
    await createWallet(bot,chatId);
    await createSettings(chatId);
  }

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    
    return;
  }

  const { message, keyboard } = await startInterval.getMessage(
    chatId,
    wallet.address
  );

  if (refresh === false) {
    console.log("Lol")
    console.log(message)
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
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
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: keyboard,
        },
      })
      .catch(() => { });
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
};

startInterval.getMessage = async (userId, walletAddress) => {
  console.log(await findInit(userId.toString(),'EQDv68b3JaWBO_DrP6u13Oq7KsnKhR926kMxcOJwACDY_uQC'))
  const walletBalance = await tonweb.getBalance(walletAddress);
  console.log(walletAddress)
  try{
  tokenAccounts=await fetchJettonBalances(walletAddress)}
  catch{
    await sleep(2000)
    tokenAccounts=await fetchJettonBalances(walletAddress)
  }
  console.log(tokenAccounts)
  console.log(tokenAccounts.length)
  if (tokenAccounts.length==0) {
    return {
      message: welcomeMsg({ walletAddress, walletBalance }),
      keyboard: startKeyboard(),
    };
  }

  for (i = tokenAccounts.length - 1; i >= 0; i--) {
    const {tokenAddress } = tokenAccounts[i];
    const data=await fet(tokenAddress)
    console.log(data)
    const baddress=data.bounceable.b64url
    let metadata=await MetaData(baddress)
    console.log(metadata)
    
    pool= await getPrice(tokenAddress,"EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez")
    const {initial, baseAmount, quoteAmount}=await getTradesData(userId,baddress)
    console.log(quoteAmount)
    console.log(baseAmount)
    
    const quoteAmounts=await getOutamount0(tokenAddress,"EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez",quoteAmount)
    
    profitTon=(quoteAmounts.price -baseAmount)/1e9
    tokenAccounts[i].profit=profitTon
    const divisor = Math.pow(10, tokenAccounts[i].dec);
    console.log(tokenAccounts[i].balance)
    console.log(tokenAccounts[i])
    
    tokenAccounts[i].balance=tokenAccounts[i].balance/divisor
    console.log(tokenAccounts[i].balance)
    tokenAccounts[i].pool=pool.pool
    console.log((tokenAccounts[i].dec))
    multi =Math.pow(10,tokenAccounts[i].dec)
    const amount=tokenAccounts[i].balance*multi
    console.log(amount)
      const worth=await getOutamount0(tokenAddress,"EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez",amount)
      console.log(worth)
      try{
      tokenAccounts[i].price=worth.price
    tokenAccounts[i].mcap=metadata.fdv_usd  
    tokenAccounts[i].priceUsd=metadata.price_usd
    tokenAccounts[i].fdv_usd==metadata.fdv_usd
    tokenAccounts[i].total_reserve=metadata.total_reserve_in_usd
    tokenAccounts[i].total_supply=metadata.total_supply
    tokenAccounts[i].h24=metadata.volume_usd.h24
    tokenAccounts[i].initial=findInit(userId.toString(),baddress)/1e9
    
  }catch{ startInterval.getMessage(userId, walletAddress)}}

  return {
    message: positionsMsg({ tokenAccounts, walletBalance }),
    keyboard: startKeyboard(),
  };
};

module.exports = {
  start,
};
