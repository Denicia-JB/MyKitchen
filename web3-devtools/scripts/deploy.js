const hre = require("hardhat");

async function main() {

    const currentTimestampinSecs = Math.round(Date.now() /1000);
    const unlockTime = currentTimestampinSecs +60;

    const lockedAmt = hre.ethers.parseEther("0.001");

    const newContract = await hre.ethers.getContractFactory("Lock");

    const deployedContract = await newContract.deploy(unlockTime, {value: lockedAmt})

    await deployedContract.waitForDeployment();

    console.log("Contract address is: " + deployedContract.address);

    console.log(deployedContract);
}
main();