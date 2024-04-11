const TonWeb=require('tonweb');
const { getHttpEndpoint } =  require("@orbs-network/ton-access");
const{ Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS ,getJettonWallet} = require('@ston-fi/sdk');
const {fetJeton}=require('@/services/tonapi')
const MetaData = async (Adress) => {
   try{
  const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/ton/tokens/${Adress}`, {
      method: 'GET',
      headers: {
          'accept': 'application/json'
      }}
 );
  const data = await response.json();
  return data.data.attributes;}catch{}}
const getPrice=async (JETTON0,JETTON1) => {
  

   
  try{
    const endpoint = await getHttpEndpoint();
    const provider = new TonWeb.HttpProvider(endpoint);
  
    const router = new Router(provider, {
      revision: ROUTER_REVISION.V1,
      address: ROUTER_REVISION_ADDRESS.V1,
    });
  
    const routerData = await router.getData();
  
    const {
      isLocked,
      adminAddress,
      tempUpgrade,
      poolCode,
      jettonLpWalletCode,
      lpAccountCode,
    } = routerData;
  
    const pool = await router.getPool({ jettonAddresses: [JETTON0, JETTON1] });
  
    if (!pool) {
      throw Error(`Pool for ${JETTON0}/${JETTON1} not found`);
    }
  
    const poolAddress = await pool.getAddress();
  
    const poolData = await pool.getData();
    let {
      reserve0,
      reserve1,
      token0WalletAddress,
      token1WalletAddress,
      lpFee,
      protocolFee,
      refFee,
      protocolFeeAddress,
      collectedToken0ProtocolFee,
      collectedToken1ProtocolFee,
    } = poolData;
  
    console.log(JETTON1)
    console.log(token1WalletAddress.toString())
    if(token1WalletAddress.toString()=='0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f'){
      reserve1 = poolData.reserve0;
      reserve0 = poolData.reserve1;
      
      token0WalletAddress= poolData.token1WalletAddress;
      token1WalletAddress= poolData.token0WalletAddress;
    }
    let dec
    console.log(JETTON0)
    try{          
    
 data=await fetJeton(JETTON0)

console.log(data)
dec=data.metadata.decimals
}catch(e){dec=9}
 const divisor = Math.pow(10, dec);
    if (token1WalletAddress) {
      const expectedOutputsData = await pool.getExpectedOutputs({
        amount: new TonWeb.utils.BN(divisor),
        jettonWallet: token1WalletAddress,
      });
      
  
      const { jettonToReceive, protocolFeePaid, refFeePaid } =
        expectedOutputsData;
        return ({price:jettonToReceive.toNumber(),pool:reserve0.toNumber()})
    }
    
    
  }catch(e)
  {console.log(e)
    return null}}
  const getOutamount=async (JETTON0,JETTON1,amount) => {
  

   
  
    const endpoint = await getHttpEndpoint();
    const provider = new TonWeb.HttpProvider(endpoint);
  
    const router = new Router(provider, {
      revision: ROUTER_REVISION.V1,
      address: ROUTER_REVISION_ADDRESS.V1,
    });
  
    const routerData = await router.getData();
  
    const {
      isLocked,
      adminAddress,
      tempUpgrade,
      poolCode,
      jettonLpWalletCode,
      lpAccountCode,
    } = routerData;
  
    const pool = await router.getPool({ jettonAddresses: [JETTON0, JETTON1] });
  
    if (!pool) {
      throw Error(`Pool for ${JETTON0}/${JETTON1} not found`);
    }
  
    const poolAddress = await pool.getAddress();
  
    const poolData = await pool.getData();
    let {
      reserve0,
      reserve1,
      token0WalletAddress,
      token1WalletAddress,
      lpFee,
      protocolFee,
      refFee,
      protocolFeeAddress,
      collectedToken0ProtocolFee,
      collectedToken1ProtocolFee,
    } = poolData;
    console.log(token1WalletAddress.toString()=='0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f')
    if(token1WalletAddress.toString()=='0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f'){
      jetton1Reserve = poolData.reserve0;
      jetton0Reserve = poolData.reserve1;
      token0WalletAddress= poolData.token1WalletAddress;
      token1WalletAddress= poolData.token0WalletAddress;
    }
  
    
  
    if (token0WalletAddress) {
      const expectedOutputsData = await pool.getExpectedOutputs({
        amount: new TonWeb.utils.BN(amount),
        jettonWallet: token0WalletAddress,
      });
  
      const { jettonToReceive, protocolFeePaid, refFeePaid } =
        expectedOutputsData;
        return ({price:jettonToReceive.toNumber(),pool:reserve0.toNumber()})
  
    
    
  }}
  const getOutamount0=async (JETTON0,JETTON1,amount) => {
  

   
  
    const endpoint = await getHttpEndpoint();
    const provider = new TonWeb.HttpProvider(endpoint);
  
    const router = new Router(provider, {
      revision: ROUTER_REVISION.V1,
      address: ROUTER_REVISION_ADDRESS.V1,
    });
  
    const routerData = await router.getData();
  
    const {
      isLocked,
      adminAddress,
      tempUpgrade,
      poolCode,
      jettonLpWalletCode,
      lpAccountCode,
    } = routerData;
  
    const pool = await router.getPool({ jettonAddresses: [JETTON0, JETTON1] });
  
    if (!pool) {
      throw Error(`Pool for ${JETTON0}/${JETTON1} not found`);
    }
  
    const poolAddress = await pool.getAddress();
  
    const poolData = await pool.getData();
    let {
      reserve0,
      reserve1,
      token0WalletAddress,
      token1WalletAddress,
      lpFee,
      protocolFee,
      refFee,
      protocolFeeAddress,
      collectedToken0ProtocolFee,
      collectedToken1ProtocolFee,
    } = poolData;
    console.log(token1WalletAddress.toString()=='0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f')
    if(token1WalletAddress.toString()=='0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f'){
      jetton1Reserve = poolData.reserve0;
      jetton0Reserve = poolData.reserve1;
      token0WalletAddress= poolData.token1WalletAddress;
      token1WalletAddress= poolData.token0WalletAddress;
    }
    
  
    if (token0WalletAddress) {
      console.log(amount)
      const expectedOutputsData = await pool.getExpectedOutputs({
        amount: new TonWeb.utils.BN(amount),
        jettonWallet: token1WalletAddress,
      });
  
      const { jettonToReceive, protocolFeePaid, refFeePaid } =
        expectedOutputsData;
        return ({price:jettonToReceive.toNumber(),pool:reserve0.toNumber()})
  
    
    
  }}
async function fetchJettonBalances(address) {
    const url = `https://tonapi.io/v2/accounts/${address}/jettons`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'accept': 'application/json','Authorization': `Bearer AGFBRU3RI63ATTAAAAABF6I5E7XSAOL5UWKGKDOZWHJBNEEFXSXERA2KWU3H4RE27C7WJKY` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const result = data.balances
        .filter(item => parseFloat(item.balance) >= 0.00001) // Use parseFloat to convert balance to a number if it's a string
        .map(item => ({
            balance: item.balance,
            tokenAddress: item.jetton.address,
            symbol: item.jetton.symbol,
            dec: item.jetton.decimals
        }));

        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}
module.exports={MetaData,getPrice,getOutamount,fetchJettonBalances,getOutamount0}