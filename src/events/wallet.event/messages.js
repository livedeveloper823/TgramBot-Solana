const { trim } = require('@/utils');

const walletMsg = ({ address, balance }) => `
  <b>💳 Your Wallet</b>:
    
  <b>  </b>🔑 Address: <code>${address}</code>
  <b>  </b>⚖️ Balance: <b>${balance/1e9}</b> TON.
  
  <b>  </b>Tap to copy the address and send TON to deposit.
`;

const depositMsg = () => `
  ↪️ To deposit send TON to below address:
`;

const walletAddressMsg = (address) => `
  💳 <code>${address}</code>
`;

const resetWalletMsg = () => `
  Are you sure you want to reset your Ton Sniper bot <b>Wallet</b>?

  🚨 <b>WARNING</b>: This action is irreversible!

  Ton Sniper bot will generate a new wallet for you and discard your old one.
`;

const oldPrivateKeyMsg = (secretKey) => `
  Your Private Key for your <b>OLD</b> wallet is:

  <code>${secretKey}</code>

  You can now i.e. import the key into a wallet like Solflare. (tap to copy).
  Save this key in case you need to access this wallet again.
`;

const newWalletMsg = (address) => `
  ✅ Success: Your new wallet is:

  <code>${address}</code>

  You can now send TON to this address to deposit into your new wallet. Press refresh to see your new wallet.
`;

const exportPrivateKeyMsg = () => `
  ❗️🔐 Are you sure you want to export your <b>Private Key</b>?
`;

const privateKeyMsg = (secretKey) => `
  Your <b>Private Key</b> is:

  <code>${secretKey}</code>

  You can now i.e. import the key into a wallet like Solflare. (tap to copy).
  Delete this message once you are done.
`;

module.exports = {
  walletMsg: (params) => trim(walletMsg(params)),
  depositMsg: () => trim(depositMsg()),
  walletAddressMsg: (params) => trim(walletAddressMsg(params)),
  resetWalletMsg: () => trim(resetWalletMsg()),
  oldPrivateKeyMsg: (params) => trim(oldPrivateKeyMsg(params)),
  newWalletMsg: (params) => trim(newWalletMsg(params)),
  exportPrivateKeyMsg: () => trim(exportPrivateKeyMsg()),
  privateKeyMsg: (params) => trim(privateKeyMsg(params)),
};
