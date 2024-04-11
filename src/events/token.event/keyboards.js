const buyTokenKeyboard = () => [[{ text: 'Close', callback_data: 'close' }]];

const tokenKeyboard = ({ mintAddress, settings }) => [
  [{ text: '❌ Cancel', callback_data: 'close' }],
  
  [
    { text: '(1%) Tip SOL Amount', callback_data: `tipSOLAmount` },
  ],
  [
    {
      text: `💲 Buy ${settings.leftBuyAmount} TON`,
      callback_data: `buyAmount ${mintAddress} ${settings.leftBuyAmount}`,
    },
    {
      text: `💲 Buy ${settings.rightBuyAmount} TON`,
      callback_data: `buyAmount ${mintAddress} ${settings.rightBuyAmount}`,
    },
    { text: '💲 Buy X TON', callback_data: `buyX ${mintAddress}` },
  ],
  [{ text: '🔄 Refresh', callback_data: `refreshToken ${mintAddress}` }],
];

module.exports = {
  buyTokenKeyboard,
  tokenKeyboard,
};
