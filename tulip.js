const web3 = require("@solana/web3.js");
const { PublicKey } = require("@solana/web3.js");
const {struct, blob} = require("buffer-layout");
const {i64, u64} = require("@project-serum/borsh");

const RPC_URL = "https://solana-api.projectserum.com";

const SOLFARM_PROGRAM_ID = new PublicKey('7vxeyaXGLqcp66fFShqUdHxdacp4k4kwUpRSSeoZLCZ4');
const RAYDIUM_GRAPE_USDC_VAULT = new PublicKey('C4bQFQ88k68CeT2eZVMBTRT1k8gdgXoDEAPkr4VKtgKM').toBuffer();

const USER_BALANCE_METADATA = struct([
    blob(8),
    i64("lastDepositTime"),
    u64("totalLpTokens")
]);

const connection = new web3.Connection(
    RPC_URL
);

const getTulipDepositedTokens = async (userKey) =>
{
    const [mysteryAccount, ] = await PublicKey.findProgramAddress([RAYDIUM_GRAPE_USDC_VAULT, new PublicKey(userKey).toBuffer()], SOLFARM_PROGRAM_ID);
    const [balanceAccount, ] = await PublicKey.findProgramAddress([mysteryAccount.toBuffer(), new PublicKey(userKey).toBuffer()], SOLFARM_PROGRAM_ID);

    const result = await connection.getAccountInfo(balanceAccount);

    if(!result)
    {
        console.log(`Could not find GRAPE-USD balance. Check if USER_KEY has deposited LP tokens before.`);
        return 0;
    }

    const userBalanceMetadata = USER_BALANCE_METADATA.decode(Buffer.from(result.data, "base64"));
//  console.log('LP Token Balance:', userBalanceMetadata.totalLpTokens.toNumber()/1e6);
//  console.log('Last deposit date:', new Date(userBalanceMetadata.lastDepositTime.toNumber() * 1000).toDateString());
    return userBalanceMetadata.totalLpTokens.toNumber() / 10**6;
}

module.exports = {
    getTulipDepositedTokens
}
