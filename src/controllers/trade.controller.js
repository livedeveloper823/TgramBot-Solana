const { prisma } = require('../configs/database');
async function processTrades(trades, strategyId, mintAddress) {
  let initial = 0;
  let baseAmount = 0;
  let quoteAmount = 0;
  let tradesss=[]
  try {
    for (const trade of trades) {
      
      const linked = await prisma.strategyTrade.findFirst({
        where: {
          strategyId: strategyId,
          tradeId: trade.id,
        },
      });
      
      if (trade.inputMint === 'So11111111111111111111111111111111111111112' && !linked) {
        
        initial += trade.inAmount;
        baseAmount += trade.inAmount;
        quoteAmount += trade.outAmount;
        tradesss.push(trade)
        
      }

      if (trade.inputMint === mintAddress && !linked) {
        initial -= trade.outAmount;
        quoteAmount -= trade.inAmount;
        baseAmount -= trade.outAmount;
        tradesss.push(trade)

        
      }
    }
    
    return { initial, baseAmount, quoteAmount ,tradesss};
  } catch (error) {
    console.error("Error processing trades:", error);
    return null;
  }
}

const createTrade = async (params) => {
  const trade = await prisma.trade.create({
    data: params,
  });
  return trade;
};

const getTradesData = async (userId, mintAddress) => {
  
  const trades = await prisma.trade.findMany({
    where: {
      userId: userId.toString(),
      OR: [
        { inputMint: mintAddress },
        { outputMint: mintAddress }
      ],
    },
    select: {
      inputMint: true,
      inAmount: true,
      outAmount: true,
      id:true
    },
  });
  console.log()

  let baseAmount = 0;
  let quoteAmount = 0;
  let initial = 0;
  
  trades.forEach((trade) => {
    if (trade.inputMint === 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez') {
      initial += trade.inAmount;
      baseAmount += trade.inAmount;
      quoteAmount += trade.outAmount;
      
    }
    if (trade.inputMint === mintAddress) {
      initial -= trade.outAmount;
      quoteAmount -= trade.inAmount;
      baseAmount -= trade.outAmount;
      
    }
  });
  
  return { initial, baseAmount, quoteAmount};
};
const getTradesDataauto = async (userId, mintAddress,id) => {
  const trades = await prisma.trade.findMany({
    where: {
      userId: userId.toString(),
      OR: [
        { inputMint: mintAddress },
        { outputMint: mintAddress }
      ],
    },
    select: {
      inputMint: true,
      inAmount: true,
      outAmount: true,
      id:true
    },
  });

 lol= await processTrades(trades, id, mintAddress)
 return lol
  
 
};


module.exports = {
  createTrade,
  getTradesData,
  getTradesDataauto
};
