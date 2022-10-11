# vending-machine-dapp

Following a web3 tutorial on YouTube, I completed a dApp for a vending machine smart contract (with some minor custom modifications).
 
**https://www.youtube.com/watch?v=Qu6GloG0dQk**

## VendingMachine.sol was compiled and deployed to the Georli testnet using Remix IDE.

**TXN:** https://goerli.etherscan.io/tx/0xd6667257e197e1fb1ccec99101bc6b6da46cb6caa23510a5b22d0f43abe8ad70

**CONTRACT:** https://goerli.etherscan.io/address/0xd682f835457e8a888099ba30cab28fc17b540bd7

## Current Concerns:
1. VendingMachine.sol contract currently has a bug where funds get trapped, as there is no way to withdraw funds from the contract.

## Local Setup:
1. Clone the repo
2. ```cd /vending-machine-dapp```
3. Create .env file in current directory and store INFURA_GOERLI_URL as an environment variable
3. ```npm install```
4. ```npm run dev```