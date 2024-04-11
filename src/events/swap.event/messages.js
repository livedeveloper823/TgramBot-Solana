const { trim } = require('@/utils');

const autoBuyMessage = ``;

const transactionInitiateMsg = (mode) => `
➡ Transaction sent. Waiting for confirmation... 
`;

const transactionBuildFailedMsg = () => `
  ⛔ Building transaction failed, please try again.
`;
const transactionSentMsgauto = (txid) => `
🤖 Autobuy Transaction triggered. 
  https://solscan.io/tx/${txid}
`;
const transactionSentMsg = (txid) => `
  ➡ Transaction sent. Waiting for confirmation...
  https://solscan.io/tx/${txid}
`;

const transactionConfirmedMsg = (txid,toamount,symbol1,symbol2) => `
  ✅ Swap Successful <b> ${txid} ${symbol1}</b> to <b> ${toamount} ${symbol2}</b>
    
`;

const transactionFailedMsg = (txid) => `
  📛 Swap failed
  https://solscan.io/tx/${txid}
`;

const wrapAutoBuy = (msg, mode, isAuto) => {
  if (mode === 'buy' && isAuto) {
    return `
      ${msg}
      🚨 <i>This trade was triggered with Auto Buy enabled. To enable confirmations or change the buy amount go to Settings (press /settings).</i>
    `;
  }
  if (mode === 'sell' && isAuto) {
    return `
      ${msg}
      🚨 <i>This trade was triggered with Auto Sell enabled. To enable confirmations or change the sell percent go to Settings (press /settings).</i>
    `;
  }
  return msg;
};

module.exports = {
  transactionInitiateMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionInitiateMsg(mode), mode, isAuto)),

  transactionBuildFailedMsg: ({ mode, isAuto }) =>
    trim(wrapAutoBuy(transactionBuildFailedMsg(), mode, isAuto)),

  transactionSentMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionSentMsg(txid), mode, isAuto)),
  transactionSentMsgauto: ({ mode, isAuto, txid}) =>
    trim(wrapAutoBuy(transactionSentMsgauto(txid), mode, isAuto)),
  transactionConfirmedMsg: ({ mode, isAuto, txid  ,toamount,symbol1,symbol2}) =>
    trim(wrapAutoBuy(transactionConfirmedMsg(txid,toamount,symbol1,symbol2)), mode, isAuto,),

  transactionFailedMsg: ({ mode, isAuto, txid }) =>
    trim(wrapAutoBuy(transactionFailedMsg(txid), mode, isAuto)),
};
