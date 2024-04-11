
const { VersionedTransaction } = require('@solana/web3.js');
const { Connection } = require('@solana/web3.js');

const { getSwapBuy,getSwapSell } = require('@/services/ston-fi');

const TonWeb = require('tonweb');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const retryTransfer = async (transfer, retries = 0, delay = 2000) => {
  try {
      const result = await transfer.send(); // Attempt to send the transfer
      
      return result; // Return the successful result
  } catch (error) {
      console.log(error)
      if (retries > 0) {
          
          await sleep(delay); // Wait for the specified delay
          return retryTransfer(transfer, retries - 1, delay); // Recursively retry
      } else {
          throw new Error('Max retries reached, transfer failed');
      }
  }
};


const initiateSwap = async ({ inputMint, outputMint, amount, payer,mode }) => {
  // Specify the desired slippage tolerance (e.g., 1%)
  
let swapTransaction
  
if(mode=="buy"){
  console.log("buy")
   swapTransaction  = await getSwapBuy({
    payer,
    JETTON0:inputMint,
    JETTON1:outputMint,
    amount
    
  });}
  else{
    console.log('sell')
    swapTransaction  = await getSwapSell({
      payer,
      JETTON0:inputMint,
      JETTON1:outputMint,
      amount
      
    })
  }
  

  return {

    swapTransaction,
  };
};


const swapToken = async (swapTxParams, payer,secretKey) => {
  
  let seqno = await payer.methods.seqno().call();
  console.log(seqno)
  if(seqno==null){seqno=0}
  const transfer=payer.methods.transfer({
    secretKey: TonWeb.utils.hexToBytes(secretKey), // Convert secret key to byte array if it's in hex
    toAddress: swapTxParams.to, // Destination address for the swap
    amount: swapTxParams.gasAmount, // Amount of tokens to send as part of the swap
    seqno: seqno, // Current sequence number of the wallet
    payload: swapTxParams.payload, // Payload generated by buildSwapJettonTxParams
    // A send mode that fits the transaction; often 3 is used for sending with bounce protection
})
console.log(payer)
console.log(TonWeb.utils.hexToBytes(secretKey))
console.log(swapTxParams.to)
console.log(swapTxParams.gasAmount)
console.log(swapTxParams.payload)
console.log(transfer)
return retryTransfer(transfer)
};
module.exports = {
  initiateSwap,
  swapToken,
  
};