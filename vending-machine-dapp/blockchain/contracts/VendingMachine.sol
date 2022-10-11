// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract VendingMachine {

    // state variables
    address public owner;
    uint public donutPrice;  // The price of one donut in wei
    mapping (address => uint) public donutBalances;

    // set the owner as th address that deployed the contract
    // set the initial vending machine balance to 100 donuts
    constructor() {
        owner = msg.sender;
        donutPrice = 100000000000000;  // 0.0001 ether
        donutBalances[address(this)] = 100;
    }

    // Function not included in deployed contract
    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(msg.sender).transfer(address(this).balance);
    }

    function getVendingMachineBalance() public view returns (uint) {
        return donutBalances[address(this)];
    }

    // Let the owner restock the vending machine
    function restock(uint amount) public {
        require(msg.sender == owner, "Only the owner can restock.");
        donutBalances[address(this)] += amount;
    }

    // Purchase donuts from the vending machine
    function purchase(uint amount) public payable {
        require(msg.value >= amount * donutPrice, "Cannot afford donut amount. Call donutPrice to see the price of one donut (in wei).");
        require(donutBalances[address(this)] >= amount, "Not enough donuts in stock to complete this purchase");
        donutBalances[address(this)] -= amount;
        donutBalances[msg.sender] += amount;
    }
}