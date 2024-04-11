const { trim, convertToShort, formatNumber, roundPrice } = require('@/utils');

const welcomeMsg = ({ walletAddress, walletBalance }) => {
  if (walletBalance) {
    return `
      <b>🐶 Ton Sniper 🐶</b>

      You currently have a balance of <b>${(walletBalance/1e9)} TON</b>, but no open positions.

      To get started trading, you can open a position by buying a token.

      To buy a token just enter a token address, and you will see a Buy dashboard pop up where you can choose how much you want to buy.

      Advanced traders can enable Auto Buy in their settings. When enabled, Ton Sniper bot will instantly buy any token you enter with a fixed amount that you set. This is disabled by default.

      Wallet: <code>${walletAddress}</code>

      💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
    `;
  }

  return `
    <b>🐶 Ton Sniper 🐶</b>

    You currently have no TON balance.

    To get started with trading, send some TON to your Tonn Sniper wallet address:

    <code>${walletAddress}</code> <i>(tap to copy)</i>

    Once done tap refresh and your balance will appear here.

    To buy a token just enter a token address of the coin.

    ⭐ <i>For more info on your wallet and to retrieve your private key, type <code>/wallet</code> command. We guarantee the safety of user funds on Tonn Sniper bot, but if you expose your private key your funds will not be safe.</i>

    💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
  `;
};

const positionsMsg = ({ tokenAccounts, walletBalance }) => {
  let msg = '';

  msg += `
    📌 Positions Overview:
  `;

  tokenAccounts.forEach((tokenAccount, index) => {
    const {
      mint,
      initial,
      symbol,
      mcap,
      priceUsd,
      h24,
      total_reserve,
      total_supply,
      tokenAddress,
      balance,
      profit,
      pool,
      price
      
    } = tokenAccount;

    msg += `
      /${index + 1} <a href="https://birdeye.so/token/${mint}?chain=solana">${symbol}</a>
      🎇 initial: <b>${initial.toFixed(5)} TON </b>
      💰 balance: <b>${(balance)} ${symbol} </b> 
      💵 worth : <b>${(price/1e9).toFixed(3)} TON </b>
      🚀 Profit: <b> ${profit.toFixed(6)} TON</b>
      🧢 Mcap:<b>${convertToShort(mcap)}</b>
      💲  Price :<b> ${priceUsd}</b>

      💹 Total reserve: <b>${convertToShort(total_reserve)}$</b>
      🔊 vol h24:<b> ${convertToShort(h24)}$ </b>
      ⛽ Pooled TON: <b>${convertToShort((pool/1e9))} TON</b>
    `;
  });

  msg += `
    ⚖️ Balance: <b>${walletBalance/1e9} TON</b>

    <i>Tip: Tap number next to token to sell and manage your position</i>
  `;

  return msg;
};

module.exports = {
  welcomeMsg: (params) => trim(welcomeMsg(params)),
  positionsMsg: (params) => trim(positionsMsg(params)),
};
