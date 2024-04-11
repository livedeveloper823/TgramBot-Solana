require('dotenv').config();
require('module-alias/register');
const { findSettings } = require('@/controllers/settings.controller');

const { findWallet } = require('@/controllers/wallet.controller');
const { prisma } = require('@/configs/database');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');

const { getPair } = require('@/services/dexscreener');
const { getBalance } = require('@/services/solana');
const { getTokenMetadata } = require('@/services/metaplex');
const{buyAmount}=require('@/events/buy.event')
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

const bot = require('@/configs/bot');
const TimeInterval = 30 * 1000;


const router = require('@/routes');
const store = require('@/store');
const { initStore } = require('@/store/utils');

router(bot);
const stores=async () =>await initStore(store);
stores()


const showToken = async ( msg, params,name,codename) => {
  await initStore(store);
  await showTokenInterval( msg, params,name,codename);

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

const showTokenInterval = async ( chatId, mintAddress,name,codename) => {
  console.log(name)
  const channel = await prisma.channels.findFirst({
    where: {
      name: name,
      
    },
    select: {
      id: true
    }
  });
  console.log(channel)
  const found = await prisma.userChannel.findUnique({
    where: {
        user_id_channel_id: {
            user_id: chatId,
            channel_id: channel.id,
        },
    },
});
  if(found.amount!=null&&found.amount!=0 ){
    prams={mintAddress:mintAddress,amount:found.amount,isAuto:true}
    buyAmount(bot,0,prams,chatId)
  }else{console.log()}
  
  params={mintAddress, refresh:true}
  refresh=false
    chatId=parseInt(chatId)
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

  const { message, keyboard } = await showTokenInterval.getMessage({
    walletAddress: wallet.publicKey,
    mintAddress,
    settings,name,codename
  });

  if (refresh === false && message!=false) {
    console.log("lol")
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
    setTimeout(() => {
      
      process.exit();
  }, 3000);
    
  } 
}

showTokenInterval.getMessage = async ({ walletAddress, mintAddress, settings,name,codename }) => {
  let metadata, walletBalance;
  let priceUsd, priceChange;
  let liquidity, pooledSol;

  try {
    metadata = await getTokenMetadata(mintAddress);
    console.log(metadata)
  } catch (e) {
    console.error(e);
    return {
      message: false,
      keyboard: [],
    };
  }

  try {
    walletBalance = await getBalance(walletAddress);
  } catch (e) {
    console.error(e);
    return {
      message: error.message,
      keyboard: [],
    };
  }

  try {
    const pair = await getPair(mintAddress);
    pairadress=pair.pairAddress
    link=pair.info.imageUrl
    priceUsd = parseFloat(pair.priceUsd);
    priceChange = pair.priceChange;
    liquidity = pair.liquidity.usd / 2;
    pooledSol = pair.liquidity.quote
  } catch (e) {
    console.error(e);
    return {
      message: noRouteMsg({
        channelname:codename,
       
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
        mintAddress,
        walletBalance,
      }),
      keyboard: tokenKeyboard({ mintAddress, settings }),
    };
  }

  return {
    message: tokenMsg({
    channelname:codename,
    baseaddress:pairadress,
    

      mint: mintAddress,
      name: metadata.name,
      symbol: metadata.symbol,
      priceUsd,
      priceChange,
      mcap:
        (priceUsd * metadata.mint.supply.basisPoints.toString()) /
        10 ** metadata.mint.decimals,
      liquidity,
      pooledSol,
      walletBalance,
    }),
    keyboard: tokenKeyboard({ mintAddress, settings }),
  };
};
const args = process.argv.slice(2); // Removes the first two default entries
showToken(args[0], args[1],args[3],args[2]);