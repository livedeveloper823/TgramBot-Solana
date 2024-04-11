const { prisma } = require('../configs/database');
const bs58 = require('bs58');
const store = require('@/store');
const { Keypair } = require('@solana/web3.js');
const TonWeb = require("tonweb");
const tonMnemonic = require("tonweb-mnemonic");
const {memMessage} = require("./messages");
const findAllWallets = async () => {
  const wallets = await prisma.wallet.findMany();
  return wallets;
};

const createWallet = async (bot,id) => {
  try {
   


    // Generate mnemonic phrase
    const words = await tonMnemonic.generateMnemonic();
    const mnemonicPhrase = words.join(' ');

    // Convert mnemonic to seed and generate key pair
    const seed = await tonMnemonic.mnemonicToSeed(words);
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed.slice(0, 32));

    // Initialize TonWeb
    const tonweb = new TonWeb();

    // Define the wallet smart contract class
    const WalletClass = tonweb.wallet.all.v3R2;

    // Create a wallet instance with the public key
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });

    // Get the wallet address
    const addresss = await wallet.getAddress();

    // Extract and format public and secret keys
    const publicKey = TonWeb.utils.bytesToHex(keyPair.publicKey);
    const secretKey = TonWeb.utils.bytesToHex(keyPair.secretKey);

    // Return the generated credentials along with the wallet address
    const address=addresss.toString(true, true, false)

    const wallets = await prisma.wallet.create({
      data: {
        id: id.toString(),
        publicKey,
        secretKey,
        address
      },
    });

    store.setWallet(wallets);
    bot.sendMessage(id, memMessage(mnemonicPhrase), {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      
    });
    return wallet;
  } catch(error) {
    console.error(error.message)
    return null;
  }
};
const findWallet = (id) => {
  return store.getWallet(id.toString());
};

const updateWallet = async (id) => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = bs58.encode(keypair.secretKey);

  const wallet = await prisma.wallet.update({
    where: {
      id: id.toString(),
    },
    data: {
      publicKey,
      secretKey,
    },
  });

  store.setWallet(wallet);

  return wallet;
};

module.exports = {
  findAllWallets,
  createWallet,
  findWallet,
  updateWallet,
};
