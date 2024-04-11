const positionKeyboard = ({
  tokenAccount: { mint, ata, symbol },
  index,
  settings,
}) => [
  [{ text: '❌ Close', callback_data: 'close' }],
  [
    { text: '(1%) Tip TON Amount', callback_data: `tipTONAmount` },
  ],
  [
    {
      text: `💲 Buy ${settings.leftBuyAmount} TON`,
      callback_data: `buyAmount ${mint} ${settings.leftBuyAmount} p`,
    },
    {
      text: `💲 Buy ${settings.rightBuyAmount} TON`,
      callback_data: `buyAmount ${mint} ${settings.rightBuyAmount} p`,
    },
    { text: '💲 Buy X TON ', callback_data: `buyX ${mint} p` },
  ],
  [
    { text: '◀️ Prev', callback_data: `refreshManagePositions ${index - 1}` },
    { text: `${symbol}`, callback_data: 'none' },
    { text: 'Next ▶️', callback_data: `refreshManagePositions ${index + 1}` },
  ],
  [
    {
      text: `🔻 Sell ${settings.leftSellAmount}%`,
      callback_data: `sellPercent ${mint} ${settings.leftSellAmount}`,
    },
    {
      text: `🔻 Sell ${settings.rightSellAmount}%`,
      callback_data: `sellPercent ${mint} ${settings.rightSellAmount}`,
    },
    { text: '🔻 Sell X %', callback_data: `sellX ${mint}` },
  ],
 
  [{ text: '🔄 Refresh', callback_data: `refreshManagePositions ${index}` }],
];

const noOpenPositionsKeyboard = () => [
  [{ text: 'Close', callback_data: 'close' }],
];

module.exports = {
  positionKeyboard,
  noOpenPositionsKeyboard,
};
