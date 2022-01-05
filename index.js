const { getTulipDepositedTokens } = require('./tulip');
const { getFranciumDepositedTokens } = require('./francium');

const USER_KEY = '7yTohrf6Hs6uQwiJHbLpdM1hhDaimURvBMAsZdys5JmD';
getTulipDepositedTokens(USER_KEY).then(result =>
    console.log('Number of LP tokens in Tulip:', result)
);
getFranciumDepositedTokens(USER_KEY).then(result =>
    console.log('Number of LP tokens in Francium:', result)
);

