const { trim, convertToShort, roundPrice, formatNumber } = require('@/utils');

const positionMessage = ({
  tokenAccount: {
    fdv_usd,
    tokenAddress,
    initial,
    worth,
    mcap,
    priceUsd,
    balance,
    profit,
    pool,
    symbol,
    Address
  },

  walletBalance,
}) => `
   | <b>${symbol}</b>

  🪅 CA: <code>${Address}</code>
  ✨ initial :<b>${initial.toFixed(5)} </b>
  💰 balance: <b>${(balance).toFixed(5)} ${symbol} </b> 
  🚀 Profit: <b> ${profit.toFixed(5 )} TON</b> 
  ⛽ Pooled TON: <b>${convertToShort((pool/1e9))} TON</b>
  💱 Worth :  <b>${(worth).toFixed(4)} TON</b>
  ⚖️ Balance: <b>${balance}</b> <b>${symbol}</b>
  💲 price :<b> ${priceUsd}$</b>
  🧢 mcap : <b>${convertToShort(mcap)}</b>
  
  💳 Wallet Balance: <b>${walletBalance/1e9}</b> <b>TON</b>
`;

const noOpenPositionsMessage = () => `No open positions`;

module.exports = {
  positionMessage: (params) => trim(positionMessage(params)),
  noOpenPositionsMessage: () => trim(noOpenPositionsMessage()),
};
