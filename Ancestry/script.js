const {ethers} = require("ethers");

module.exports = (async function () {

    const provider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");

    const blockNumber = await provider.getBlockNumber();

    console.log("Current block number: " + blockNumber);
   
})();