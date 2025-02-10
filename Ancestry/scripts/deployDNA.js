const hre = require("hardhat");


async function main() {
   
    const newContract = await hre.ethers.getContractFactory("DNAmap");

    const deployedContract = await newContract.deploy("");

    await deployedContract.waitForDeployment();

    console.log(`https://sepolia.etherscan.io/address/${deployedContract.target}`);    
}
main().catch((error)=> {
    console.error(error);
    process.exitCode =1;
});