const { Connection, PublicKey }  = require('@solana/web3.js');
const FranciumSDK = require('francium-sdk').default;

const fr = new FranciumSDK({
    connection: new Connection('https://free.rpcpool.com')
});

const getFranciumDepositedTokens = async (userKey) => {
    const result = await fr.getUserFarmPosition(new PublicKey(userKey));
    const grapeInfo = result.find(o => o.priceKey === 'GRAPE-USDC');
    if(!grapeInfo)
    {
        console.log('Could not find GRAPE-USD balance. Check if USER_KEY has deposited Grape and USDC.');
        return 0;
    }
    return grapeInfo.lpAmount.toNumber()/10**6;
}

module.exports = {
    getFranciumDepositedTokens
}