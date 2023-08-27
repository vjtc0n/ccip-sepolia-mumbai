# Cross Chain DEFI Example

**Note**: If you send a message and token(s) to EOA, only tokens will arrive

# Use Case Description

Our use case works off of two three smart contracts

- a "Sender" Contract on Sepolia (source chain)
- a "Protocol" contract on Mumbai (destination chain) and
- a Mock StableCoin contract (controlled by the Protocol)

Chainlink CCIP fees are paid using LINK tokens. They can also be paid in the [chain's native token](https://documentation-private-git-ccip-documentation-chainlinklabs.vercel.app/ccip/architecture#ccip-billing) but in this example we pay CCIP fees in LINK.

The stablecoin in this example repo is a mocked USDC token.

The borrowed token must then be repaid in full, following which the protocol contract will update the borrowers ledger balances and send a CCIP message back to the source chain.

# Use Case Setup - Prerequisites

Please go through this section and complete the steps before you proceed with the rest of this README.

This project uses [Hardhat tasks](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts). Each task file is named with a sequential number prefix that is the order of steps to use this use case's code.

Clone the project and run `npm install` in the repo's root directory.

You need to fund your developer wallet EOA on the source chain as well as on the destination chain.

On the source chain Sepolia (where `Sender.sol` is deployed you need):

- LINK tokens (learn how to get them for each chain [here](https://docs.chain.link/resources/link-token-contracts))
- CCIP-BnM Tokens (Burn & Mint Tokens) for that chain using the `drip()` function (see [here](https://docs.chain.link/ccip/test-tokens#mint-test-tokens))
- A little Sepolia Eth (go [here](https://faucets.chain.link/sepolia))

On the destination chain chain Mumbai (where `Protocol.sol` is deployed you need):

- LINK tokens (use the same URL from before but switch networks and make sure you're interacting with the right LINK token contract)
- A little Mumbai Polygon (go [here](https://mumbaifaucet.com))

## Configuration

This repo has been written to make it easy for you to quickly run through its steps. It has favoured ease of use over flexibility, and so it assumes you will follow it without modification. This means the configuration is already done for you in the code. You just need to supply the environment variables in the next step and make sure your wallet is funded with the right tokens on each of the chains.

You can inspect the configuration details in the `./networks.js` file. This file exports config data that are used by the tasks in `./tasks`.

## Environment Variables.

For optimized security, we recommend that you do not store your environment variables in human readable form. This means we don't use a `.env` file. Instead we use the the [@chainlink/env-enc NPM package](https://www.npmjs.com/package/@chainlink/env-enc).

Before you proceed make sure you have the following environment variables handy. Note that the Avalanche [RPC HTTPS endpoints](https://docs.avax.network/apis/avalanchego/public-api-server) can be looked up here, but since they're public one has been included directly below.

```
PRIVATE_KEY  // your dev wallet private key.
```

By using the `env-enc` package, we encrypt our secrets "at rest", meanining that we do have a local `.env.enc` file but the secrets are recorded there in encrypted form. Since it's not human readable, even if you accidentally push it to a git repo, your secrets won't be compromised.

However the package encrypts your secrets with a password that you must supply - and remember - used for encrypting and decrypted.

Steps are to encrypt your secrets and store them in a local `env.enc` file in this project are found in the "Commands" section [here.](https://www.npmjs.com/package/@chainlink/env-enc)

Once you've encrypted your variables (check with `npx env-enc view`) they will automatically be decrypted and injected into your code at runtime. This is achieved my importing the package in `./hardhat.config.js` with:

`require("@chainlink/env-enc").config()`

If you have issues running the code, and you see error messages like "THIS HAS NOT BEEN SET" then it means that an environment variable has not been set. Re-check this step.

⚠️ **Note:** If you see an error like "Error HH18: You installed Hardhat with a corrupted lockfile due to the NPM bug #4828" simply run `npm install` again.

# Running the Usecase's Steps

Just to refresh your memory, in this use case we deploy the `Sender.sol` contract, which accepts user deposits on the source chain, to the Avalanche Sepolia C Chain, which will be our source chain.

We then deploy the `Protocol.sol` contract to Mumbai, which will be our destination chain.

Each step is a Hardhat Task. Each Task is in separate,, sequentially numbered file in `./tasks`. Just follow the sequence and make a note of the console outputs

1. Deploy and fund Sender on Sepolia
   `./script/01-setup-sender.sh`

2. Deploy & Fund Protocol on Mumbai
   `./script/02-xxx.sh`

3. Send tokens and data from Mumbai to Mumbai (From `Sender.sol` to `Protocol.sol`). We send only 100 "wei" units - i.e. 0.0000000000000001 CCIP-BnM tokens.

   `./script/03-xxx.sh`

Make a note of the Source Tx Hash that get's printed to your console. You will need this. You can also open the CCIP Explorer URL that gets printed to your console.

Due to the cross-chain nature of CCIP and the different block confirmation times, and the architecture of cryptographic security offered by Chainlink, sending tokens and data can take between 5 and 15 minutes. This is largely driven by the architecture and performance of the source chain.

4. Check the message has been received on the destination chain.

   `./script/04-xxx.sh`

5. Initiate the borrow/swap of the deposited token for the Mock USDC token.

   `./script/05-xxx.sh`

6. Repay the borrowing

   `./script/06-xxx.sh`

Similarly, the borrower must also approve the `Protocol` contract as a "spender" of the's CCIP-BnM tokens borrowed. The `Protocol` then transfers those borrowed token to itself before authorizing the Router to transfer them back to Sepolia.

7. Doing other things...
