const walletKeyboard = ({ address }) => [
  [
    
    { text: '❌ Close', callback_data: 'close' },
  ],
  [{ text: '📤 Deposit TON', callback_data: 'deposit' }],
  [
    { text: '📤 Withdraw all TON', callback_data: 'withdrawAll' },
    { text: '📤 Withdraw X TON', callback_data: 'withdrawX' },
  ],
  [
    { text: '🔃 Reset Wallet', callback_data: 'resetWallet' },
    { text: '🔑 Export Private Key', callback_data: 'exportPrivateKey' },
  ],
  [{ text: '🔄 Refresh', callback_data: 'refreshWallet' }],
];

const resetWalletKeyboard = () => [
  [
    { text: '❌ Cancel', callback_data: 'close' },
    { text: '✔️ Confirm', callback_data: 'confirmResetWallet' },
  ],
];

const exportPrivateKeyKeyboard = () => [
  [
    { text: '❌ Cancel', callback_data: 'close' },
    { text: '✔️ Confirm', callback_data: 'confirmExportPrivateKey' },
  ],
];

module.exports = {
  walletKeyboard,
  resetWalletKeyboard,
  exportPrivateKeyKeyboard,
};
