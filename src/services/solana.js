const bs58 = require('bs58');
const {
  Wallet
} = require('@coral-xyz/anchor');
const {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} = require('@solana/spl-token');
const {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} = require('@solana/web3.js');
const connection = require('@/configs/connection');

const getWallet = (secretKey) => {
  return new Wallet(Keypair.fromSecretKey(bs58.decode(secretKey)));
};

const getBalance = async (walletAddress) => {
  const publicKey = new PublicKey(walletAddress);
  const res = await connection.getBalance(publicKey);
  return (1.0 * res) / LAMPORTS_PER_SOL;
};

const getParsedAccountInfo = async (address) => {
  const publicKey = new PublicKey(address);
  const res = await connection.getParsedAccountInfo(publicKey, {});
  return res;
};

const getTokenSupply = async (mint) => {
  const res = await connection.getTokenSupply(new PublicKey(mint));
  return res.value;
};

const getTokenAccountsByOwner = async (owner) => {
  const res = await connection.getTokenAccountsByOwner(new PublicKey(owner), {
    programId: new PublicKey(TOKEN_PROGRAM_ID),
  });
  return res.value;
};

const getConfirmation = async (txid) => {
  const result = await connection.getSignatureStatus(txid, {
    searchTransactionHistory: true,
  });
  return result.value?.confirmationStatus;
};

const getATASync = async (mint, owner) => {
  const ata = await getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(owner)
  );
  return ata.toBase58();
};

const confirmTransaction = async (txid) => {
  try {
    /* const latestBlockHash = await connection.getLatestBlockhash()
    console.log(txid)
    console.log(latestBlockHash.blockhash)
    console.log(latestBlockHash.lastValidBlockHeight) */

    const res = await connection.confirmTransaction({
      /* blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight, */
      signature: txid,
    });

    if (res.value.err) {
      return res.value.err.toString(); //arrumar isso aqui
    }

    return res;
  } catch (e) {
    console.  error(e.message);
    return false;
  }

};

module.exports = {
  getWallet,
  getBalance,
  getParsedAccountInfo,
  getTokenSupply,
  getTokenAccountsByOwner,
  getConfirmation,
  getATASync,
  confirmTransaction,
};