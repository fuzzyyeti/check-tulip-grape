const web3 = require("@solana/web3.js");
const { PublicKey } = require("@solana/web3.js");
const {struct, blob} = require("buffer-layout");
const {i64, u64} = require("@project-serum/borsh");
const RPC_URL = "https://solana-api.projectserum.com";

const SOLFARM_PROGRAM_ID = new PublicKey('7vxeyaXGLqcp66fFShqUdHxdacp4k4kwUpRSSeoZLCZ4');
const USER_KEY = new PublicKey('7yTohrf6Hs6uQwiJHbLpdM1hhDaimURvBMAsZdys5JmD').toBuffer();
const RAYDIUM_GRAPE_USDC_VAULT = new PublicKey('C4bQFQ88k68CeT2eZVMBTRT1k8gdgXoDEAPkr4VKtgKM').toBuffer();

const USER_BALANCE_METADATA = struct([
    blob(8),
    i64("lastDepositTime"),
    u64("totalLpTokens")
]);

const connection = new web3.Connection(
    RPC_URL
);

const main = async () =>
{
    const [mysteryAccount, ] = await PublicKey.findProgramAddress([RAYDIUM_GRAPE_USDC_VAULT, USER_KEY], SOLFARM_PROGRAM_ID);
    const [balanceAccount, ] = await PublicKey.findProgramAddress([mysteryAccount.toBuffer(), USER_KEY], SOLFARM_PROGRAM_ID);

    const result = await connection.getAccountInfo(balanceAccount);

    if(!result)
    {
        console.log(`Could not GRAPE-USD balance. Check if USER_KEY has deposited LP tokens before.`);
        return;
    }

    const userBalanceMetadata = USER_BALANCE_METADATA.decode(Buffer.from(result.data, "base64"));
    console.log("LP Token Balance:", userBalanceMetadata.totalLpTokens.toNumber()/1e6);
    console.log(new Date(userBalanceMetadata.lastDepositTime.toNumber() * 1000).toDateString());

}

main();