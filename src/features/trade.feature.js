const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getTradesData } = require('@/controllers/trade.controller');

const getTrade = async ({ userId, mint, decimals, priceNative }) => {
  const { initials, baseAmounts, quoteAmounts } = await getTradesData(
    userId,
    mint
  );

  const profitSol =
    (quoteAmounts / 10 ** decimals) * priceNative -
    baseAmounts / LAMPORTS_PER_SOL;
  const profitPercent = (profitSol * 100.0) / (initials / LAMPORTS_PER_SOL);
  if(initials==NaN){initials=0}
  if(profitPercent==NaN){profitPercent=0}
  if(profitSol==NaN){profitSol=0}


  return { initial: initials / LAMPORTS_PER_SOL, profitSol, profitPercent };
};

module.exports = {
  getTrade,
};
