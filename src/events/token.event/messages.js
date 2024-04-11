const { trim, roundPrice, convertToShort, formatNumber } = require('@/utils');

const buyTokenMsg = () => `
  🛒🆔 Buy Token:

  <b>To buy a token enter a token address or name.</b>
`;

const tokenMsg = ({
  vol,
  total_reserve,
  name,
  mcap,
  priceUsd,
  price,
  pool,
  symbol,
  mint,
  address,
  walletBalance,
}) => {
  return `
    📌 <b>${name}</b> | <b>${symbol}</b>

     
    💵 Price : <b>${(price/1e9).toFixed(3)} TON </b>
    🧢 Mcap:<b>${convertToShort(mcap)}</b>
    💲  Price :<b> ${priceUsd}$</b> 
    💹 Total reserve: <b>${convertToShort(total_reserve)}$</b>
    🔊 vol h24:<b> ${convertToShort(vol)}$ </b>
    ⛽ Pooled TON: <b>${convertToShort((pool/1e9))} TON</b>
    🎈 ca : <code>${mint}</code>

    💳 Wallet Balance: <b>${walletBalance/1e9} TON</b>
    👇 To buy press one of the buttons below.
  `;
};

const copyWalletMsg = () => `Input a wallet address to copy trade and amount in SOL. Example:
  <code>6fbQRbFreSmosZ1afadJzDtFxPreGwgFTedPHjcjcNGp</code> 0.9
`;

const noRouteMsg = ({ tokenName, tokenSymbol, mintAddress, walletBalance }) => `
  ${tokenName} | <b>${tokenSymbol}</b> | <code>${mintAddress}</code>

  💥 5m: <b>NaN%</b>, 1h: <b>NaN%</b>, 6h: <b>NaN%</b>, 24h: <b>NaN%</b>
  🔼 Market Cap: <b>$N/A</b>

  🚨 <i>WARNING: No route found. Ton Sniper bot instant swap is currently only available for -SOL pairs on Raydium AMM v4 and Orca CLMM. Please try again later.</i>

  💳 Wallet Balance: <b>${walletBalance} SOL</b>
  👇 To buy press one of the buttons below.
`;

const tokenNotFoundMsg = (token) => `
  ❌ Token not found. Make sure address (${token}) is correct. You can enter a token address.
`;

const tokenNotFoundInWalletMsg = (token) => `
  ❌ Token not found in your wallet. Make sure address (${token}) is correct. Check your wallet for the token (press /start).
`;

const autoBuyFailedMsg = ({ amount, walletBalance }) => `
  Auto Buy amount (${amount.toFixed(
  4
)} TON) is greater than your wallet balance (${walletBalance} TON). Please disable Auto Buy or lower the amount.
`;

const invalidInputMsg = () => `
  Invalid input. Please try again. Example: <code>6fbQRbFreSmosZ1afadJzDtFxPreGwgFTedPHjcjcNGp</code> 0.9
`;

const invalidWalletAddressMsg = () => `
  Invalid wallet address. Please check again.
`;

const copyTradeMsg = () => `
  Copy trade created successfully. Your funds will now track the selected wallet.
`;

const tokenSniperSettingMsg = () => `
  To sniper a token, enter a token address or name.
`;

module.exports = {
  buyTokenMsg: () => trim(buyTokenMsg()),
  tokenMsg: (params) => trim(tokenMsg(params)),
  copyWalletMsg: () => trim(copyWalletMsg()),
  tokenNotFoundMsg: (params) => trim(tokenNotFoundMsg(params)),
  tokenNotFoundInWalletMsg: (params) => trim(tokenNotFoundInWalletMsg(params)),
  noRouteMsg: (params) => trim(noRouteMsg(params)),
  autoBuyFailedMsg: (params) => trim(autoBuyFailedMsg(params)),
  invalidInputMsg: () => trim(invalidInputMsg()),
  invalidWalletAddressMsg: () => trim(invalidWalletAddressMsg()),
  copyTradeMsg: () => trim(copyTradeMsg()),
  tokenSniperSettingMsg: () => trim(tokenSniperSettingMsg()),
};
