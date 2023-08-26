task("get-token-supply", "Proves that MockUSDC has been deployed on testnet")
  .addParam("protocoladdress", "Contract address for the protocol token")
  .setAction(async (taskArgs, hre) => {
    if (network.name != "sepolia" && network.name != "mumbai") {
      throw Error("This command is intended to be used with either sepolia or mumbai.")
    }

    const protocolContractFactory = await ethers.getContractFactory("Protocol")
    const protocolContract = await protocolContractFactory.attach(taskArgs.protocolAddress)

    const tokenContractFactory = await ethers.getContractFactory("MockUSDC")
    const tokenContract = await tokenContractFactory.attach(await protocolContract.usdcToken())

    console.log(`MockUSDC token supply is ${await tokenContract.totalSupply()}`)
  })
