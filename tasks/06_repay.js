const { networks } = require("../networks")

task("repay", "repays the Mock USDC")
  .addParam("protocol", "address of Protocol.sol")
  .addParam("sender", "address of Sender.sol")
  .addParam("messageid", "the messageid that correlates to the token transfer tx")
  .setAction(async (taskArgs, hre) => {
    if (network.name === "hardhat") {
      throw Error("This command cannot be used on a local development chain.  Specify a valid network.")
    }
    if (network.name !== "mumbai") {
      throw Error("This task must be used on mumbai.")
    }

    const bnmToken = networks[network.name].bnmToken
    if (!bnmToken) {
      throw Error("Missing BNM Token Address")
    }

    const [borrower] = await ethers.getSigners()

    const protocolFactory = await ethers.getContractFactory("Protocol")
    const protocolContract = await protocolFactory.attach(taskArgs.protocol)

    const [sourceChainSelector, _, depositor, token, depositedAmount] =
      await protocolContract.getReceivedMessageDetails(taskArgs.messageid)

    const usdcTokenAddress = await protocolContract.usdcToken()
    const mockUsdcFactory = await ethers.getContractFactory("MockUSDC")
    const mockUsdcToken = await mockUsdcFactory.attach(usdcTokenAddress)

    const borrowerUSDCBal = await mockUsdcToken.balanceOf(borrower.address)
    const borrowerBalance = await protocolContract.borrowings(borrower.address, usdcTokenAddress)
    console.log("\nBorrowings: ", borrowerBalance.toString(), "\nRepayment amount: ", borrowerUSDCBal.toString())

    if (borrowerBalance.toString() !== borrowerUSDCBal.toString()) {
      throw Error(
        `Borrower's Mock USDC balance '${borrowerUSDCBal}' does not match the amount borrowed from Protocol '${borrowerBalance}'`
      )
    }

    if (borrowerBalance.toString() == "0") {
      console.info("\nBorrower has no outstanding borrowings.  Nothing to repay.")
      return
    }

    console.log(`\nApproving Protocol to burn borrowed tokens on behalf of borrower '${borrower.address}'`)
    // const approveBurnTx = await mockUsdcToken
    //   .connect(borrower)
    //   .approve(protocolContract.address, "1000000000000000000000")
    // await approveBurnTx.wait()
    console.log(`\nApproval to burn MockUSDC complete...`)

    console.log(`\nRepaying borrowed token...`)

    const repayTx = await protocolContract.repayAndSendMessage(
      borrowerUSDCBal,
      sourceChainSelector,
      taskArgs.sender,
      taskArgs.messageid,
      {
        // Must increase gas
        // gasLimit: 10_000_000,
      }
    )
    await repayTx.wait()

    console.log(`\nRepay tx hash: ${repayTx.hash}`)

    const updatedBorrowerUSDCBal = await mockUsdcToken.balanceOf(borrower.address)
    const usdcTotalSupply = await mockUsdcToken.totalSupply()

    console.log(
      `\nBorrower's MockUSDC token balance is now  '${updatedBorrowerUSDCBal}' and the token's total supply is now ${usdcTotalSupply}`
    )
  })
