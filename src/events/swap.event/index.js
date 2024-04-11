const bs58 = require('bs58');
const { prisma } = require('@/configs/database');
const {
  Keypair
} = require('@solana/web3.js');
const {
  WalletNotFoundError
} = require('@/errors/common');
const {
  createTrade
} = require('@/controllers/trade.controller');
const {
  findWallet
} = require('@/controllers/wallet.controller');
const {
  updateBuy,updatesell
} = require('@/controllers/initial.controllers');
const {
  showPositionAfterTrade
} = require('@/events/manage.event');
const {
  coverFee
} = require('@/features/fee.feature');
const {
  initiateSwap,
  swapToken
} = require('@/features/swap.feature');
const {getOutamount,MetaData,getOutamount0}=require('@/services/TonScan');
const {
  transactionInitiateMsg,
  transactionSentMsgauto,
  transactionBuildFailedMsg,
  transactionSentMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,
} = require('./messages');
const {fet,fetJeton}=require('@/services/tonapi')
const { getHttpEndpoint } =  require("@orbs-network/ton-access");
const TonWeb = require('tonweb');
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const swap = async (bot, msg, params,chatId,add,percent) => {
  const endpoint = await getHttpEndpoint();
const provider = new TonWeb.HttpProvider(endpoint);
const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint))
  if (add==undefined){add={add:false,id:1}}
  
  if(msg!=0&&msg!=1){chatId=msg.chat.id;}
  else{chatId}
  
  let {
    inputMint,
    outputMint,
    amount,
    slippage,
    mode,
    isAuto
  } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }
 
  const WalletClass = tonweb.wallet.all.v3R2; // or another wallet class depending on your needs
  const payer = new WalletClass(provider, {publicKey: TonWeb.utils.hexToBytes(wallet.publicKey)});
  
  
  bot
    .sendMessage(chatId, await transactionInitiateMsg({
      mode,
      isAuto
    }), {
      parse_mode: 'HTML',
    })
    .then(async ({
      message_id
    }) => {
      let txid, quoteResponse;
      const address = await payer.getAddress();
      await sleep(2000)
      console.log(address.toString(true,true,false))
      const lastTx = (await tonweb.getTransactions(address, 1))[0]
      const lastTxHash = lastTx.transaction_id.hash
      
      
      try {
       
        const res = await initiateSwap({
          inputMint,
          outputMint,
          amount: mode === 'buy' ? parseInt(amount * 0.99).toString() : parseInt(amount),
          
          payer,mode
        });
        await sleep(1500)
        const balance=await tonweb.getBalance(payer.address);
        console.log(balance)
        console.log(balance<res.swapTransaction.gasAmount.toNumber())
       if(balance>res.swapTransaction.gasAmount.toNumber()){
        console.log("yay")
        await swapToken(res.swapTransaction, payer,wallet.secretKey);
        var txHash = lastTxHash
        while (txHash == lastTxHash) {
            await sleep(8000) // some delay between API calls
            try{let tx = (await tonweb.getTransactions(address, 1))[0]
            txHash = tx.transaction_id.hash
          console.log(txHash)}catch{}
         
        }}
      else if(balance<res.swapTransaction.gasAmount.toNumber()){
          
          bot.sendMessage(chatId,`insufiscient blance for swap required balance for this action ${(res.swapTransaction.gasAmount.toNumber())/1e9} TON`)
          bot.editMessageText(transactionBuildFailedMsg({
            mode,
            isAuto
          }), {
            chat_id: chatId,
            message_id,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          })
          return;
        };
       

      } catch (e) {
        console.error(e);
        
        if(amount!=0&&msg!=0){
        bot.editMessageText(transactionBuildFailedMsg({
          mode,
          isAuto
        }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });}else{ bot.editMessageText("This token is not available for buyign now.", {
          chat_id: chatId,
          message_id,
          disable_web_page_preview: true,})
        return}
      
        
      }
      
      
      try {
        try{
          const data=await fet(outputMint)
          const data1=await fet(inputMint)
        console.log(data)
        
        
        inputMint=data1.bounceable.b64url
        outputMint=data.bounceable.b64url
        }catch{}
        console.log(inputMint)
        let metadata1= await fetJeton(inputMint)
        let metadata2=await fetJeton(outputMint)
        let dec1=metadata1.metadata.decimals
        let dec2=metadata2.metadata.decimals
        let div1= Math.pow(10,dec1)
        let div2= Math.pow(10,dec2)

        console.log(metadata1)
        let amounts
        if (inputMint=="EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez"){
          amounts=(await getOutamount(inputMint,outputMint,amount)).price
          await updateBuy(chatId.toString(),outputMint,amount)}
          
         else{
            amounts=(await getOutamount0(inputMint,outputMint,amount)).price
            await updatesell(chatId.toString(),inputMint,percent)
         }
 

        bot.editMessageText(await transactionConfirmedMsg({
          mode,
          isAuto,
          txid:(amount/div1).toFixed(3),
          toamount:(amounts/div2).toFixed(3),
          symbol1:metadata1.metadata.symbol,
          symbol2:metadata2.metadata.symbol
        }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
        
       
        console.log(amount)
        
          console.log(amounts )
        if (true) {
         console.log("lol");
          
          trade =await createTrade({
            userId: chatId.toString(),
            inputMint,
            outputMint:outputMint,
            outAmount:amounts,
           
            inAmount: amount,
          });
        
          if(add.add==true){
           
            await prisma.strategyTrade.create({
              data: {
               
                strategyId: add.id,
                tradeId: trade.id,
              },
            })
          }
        }
        console.log(amounts)
        if (inputMint=="EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez"){
          coverFee(chatId,amount/100)
        }else{
          coverFee(chatId,amounts/100)

        }
       
      } catch (e) {
        console.error(e);
        if(amount!=0&&msg!=0){
        bot.editMessageText(transactionFailedMsg({
          mode,
          isAuto,
          txid
        }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      }}
    });
};

module.exports = {
  swap,
};