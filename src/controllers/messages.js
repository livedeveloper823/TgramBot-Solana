const memMessage=(mnemonicPhrase)=>
{return`<b>Your wallet has been created!</b> Here is your mnemonic phrase:

<code>${mnemonicPhrase}</code> <i>(tap to copy)</i>

Please make sure to <b>save your mnemonic phrase</b> in a safe place. It's the only way to recover your wallet.

For more info on your wallet and to retrieve your private key, type <code>/wallet</code> command. We guarantee the safety of user funds on Ton Sniper bot, but if you expose your private key, your funds will not be safe.

`}
module.exports={memMessage}