const { createIncome } = require('@/controllers/income.controller');
const {
  findRandomUser,
  findReferrer,
} = require('@/controllers/user.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const { transferLamports } = require('./transfer.feature');

const GAS_FEE = 0.09*1e9;

const coverFee = async (userId, feeAmount) => {
  const wallet = findWallet(userId).secretKey;
  const teamAddress = process.env.TEAM_WALLET_ADDRESS;
  const referrer = findReferrer(userId);
  const referrerAddress = referrer ? findWallet(referrer).address : null;

  

  const cover = async (wallet, toPubkey, amount, percent, options) => {
    const value = parseInt(amount * percent - GAS_FEE);
    if (value <= 0) {
      return;
    }
    try {
      await transferLamports(wallet, toPubkey, value);

      if (options?.isReferral) {
        createIncome({
          userId: options.toId.toString(),
          senderId: options.fromId.toString(),
          referral: value,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  //cover(fromSeckey, teamAddress, feeAmount, 1);
  /* console.log("userId", userId)
  console.log("referrer", referrer)
  console.log("teamAddress", teamAddress)
  console.log("referrerAddress", referrerAddress) */

  /* cover(fromSeckey, referrerAddress, feeAmount, 1, {
    fromId: userId,
    toId: referrer,
    isReferral: true,
  }); */

  
  //cover(fromSeckey, teamAddress, feeAmount, 1);
  
  if (referrerAddress) {
    await cover(wallet, teamAddress, feeAmount, 0.7);

    await cover(wallet, referrerAddress, feeAmount, 0.3, {
      fromId: userId,
      toId: referrer,
      isReferral: true,
    });

  } else {
    cover(wallet, teamAddress, feeAmount, 1);
  }
};

module.exports = {
  coverFee,
};
