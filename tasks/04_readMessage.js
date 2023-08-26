task("read-message", "reads CCIP message on dest contract")
  .addParam("address", "address of CCIP contract to read")
  .addParam("contract", "Name of the CCIP contract to read")
  .addParam("messageid", "messageid to retrieve from the contract")
  .setAction(async (taskArgs, hre) => {
    if (network.name != "sepolia" && network.name != "mumbai") {
      throw Error("This command is intended to be used with either sepolia or mumbai.")
    }

    let { address, contract, messageid } = taskArgs

    let ccipContractFactory
    if (contract === "Protocol") {
      ccipContractFactory = await ethers.getContractFactory("Protocol")
    } else if (contract === "Sender") {
      ccipContractFactory = await ethers.getContractFactory("Sender")
    } else {
      throw Error(`Contract ${contract} not valid. Must be "Protocol" or "Sender"`)
    }

    const ccipContract = await ccipContractFactory.attach(address)

    const [sourceChainSelector, senderContract, depositorEOA, transferredToken, amountTransferred] =
      await ccipContract.messageDetail(messageid)

    console.log(`\nmessage details received in ${contract} on ${network.name}: 
    messageId: ${messageid},
    sourceChainSelector: ${sourceChainSelector},
    senderContract: ${senderContract},
    depositorEOA: ${depositorEOA},
    transferredToken: ${transferredToken},
    amountTransferred: ${amountTransferred}
    `)

    // Checking state on Protocol.sol
    if (contract === "Protocol") {
      const deposit = await ccipContract.deposits(depositorEOA, transferredToken)

      const borrowedToken = await ccipContract.usdcToken()
      const borrowings = await ccipContract.borrowings(depositorEOA, borrowedToken)

      console.log(`Deposit recorded on Protocol: 
    Depositor: ${depositorEOA}, 
    Token: ${transferredToken}, 
    Deposited Amount: ${deposit},
    Borrowing: ${borrowings}
    `)
    }
  })
