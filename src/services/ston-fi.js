const TonWeb =require( 'tonweb');
const { getHttpEndpoint } =  require("@orbs-network/ton-access");
const { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } = require('@ston-fi/sdk');

/**
 * This example shows how to swap two jettons using the router contract
 */

const getSwapBuy=async ({payer,JETTON0,JETTON1,amount}) => {
    console.log()
  const endpoint = await getHttpEndpoint();
  const provider = new TonWeb.HttpProvider(endpoint);
  const address = await payer.getAddress();
  console.log(address.toString(true, true, false))
  const router = new Router(provider, {
    revision: ROUTER_REVISION.V1,
    address: ROUTER_REVISION_ADDRESS.V1,
  });
  const PROXY_TON = JETTON0
  console.log(JETTON1)
  const add=address.toString(true,true,false)

  // transaction to swap 1.0 JETTON0 to JETTON1 but not less than 1 nano JETTON1
  const tonToJettonTxParams = await router.buildSwapProxyTonTxParams({
    // address of the wallet that holds TON you want to swap
    
    userWalletAddress: add,
    proxyTonAddress: PROXY_TON,
    // amount of the TON you want to swap
    offerAmount: new TonWeb.utils.BN(amount),
    // address of the jetton you want to receive
    askJettonAddress: JETTON1,
    // minimal amount of the jetton you want to receive as a result of the swap.
    // If the amount of the jetton you want to receive is less than minAskAmount
    // the transaction will bounce
    minAskAmount: new TonWeb.utils.BN(1),
    // query id to identify your transaction in the blockchain (optional)
    queryId: 12345,
    // address of the wallet to receive the referral fee (optional)
    referralAddress: undefined,
  });

  
  return tonToJettonTxParams}
  const getSwapSell=async ({payer,JETTON0,JETTON1,amount}) => {
    console.log()
  const endpoint = await getHttpEndpoint();
  const provider = new TonWeb.HttpProvider(endpoint);
  const address = await payer.getAddress();
  console.log(address.toString(true, true, false))
  const router = new Router(provider, {
    revision: ROUTER_REVISION.V1,
    address: ROUTER_REVISION_ADDRESS.V1,
  });
  console.log(amount)
  const add=address.toString(true,true,false)
  console.log(JETTON0,JETTON1)
  // transaction to swap 1.0 JETTON0 to JETTON1 but not less than 1 nano JETTON1
  const swapTxParams = await router.buildSwapJettonTxParams({
    // address of the wallet that holds offerJetton you want to swap
    userWalletAddress: add,
    // address of the jetton you want to swap
    offerJettonAddress: JETTON0,
    // amount of the jetton you want to swap
    offerAmount: new TonWeb.utils.BN(amount),
    // address of the jetton you want to receive
    askJettonAddress: JETTON1,
    // minimal amount of the jetton you want to receive as a result of the swap.
    // If the amount of the jetton you want to receive is less than minAskAmount
    // the transaction will bounce
    minAskAmount: new TonWeb.utils.BN(1),
    // query id to identify your transaction in the blockchain (optional)
    queryId: 12345,
    // address of the wallet to receive the referral fee (optional)
    referralAddress: undefined,
  });

  
  return swapTxParams
};
module.exports={getSwapBuy,getSwapSell}