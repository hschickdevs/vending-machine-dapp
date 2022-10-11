import Head from 'next/head'
import Web3 from 'web3'

// Import vending machine contract instance
import vendingMachineContract from '../blockchain/vending';

import { useState, useEffect } from 'react';
import bulma from 'bulma/css/bulma.css';
import styles from '../styles/VendingMachine.module.css'

// using arrow function to be consistent with the rest of the code
const VendingMachine = () => {
    //window.ethereum

    // state variables
    // const [purchaseStatus, setPurchaseStatus] = useState('');
    const [inventory, setInventory] = useState('Connect your wallet...')
    const [donutPrice, setDonutPrice] = useState('Connect your wallet...')
    const [myDonuts, setMyDonuts] = useState('Connect your wallet...')
    const [buyCount, setBuyCount] = useState(0)
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [VendingMachineContract, setVendingMachineContract] = useState(null)

    useEffect(() => {
        if (VendingMachineContract) {
            getInventoryHandler()
            getDonutPriceHandler()
            if (address) {
                getMyDonutsHandler()
            }
        }
    }, [VendingMachineContract, address]);

    // Define a function to handle the setInventory event from the VendingMachine contract
    const getInventoryHandler = async () => {
        // Call the function using the 'call' method (because we don't need to send any ether)
        // We only need to use the 'send' method if we are going to me modifying the blockchain in any way
        const inventory = await VendingMachineContract.methods.getVendingMachineBalance().call();
        setInventory(inventory)
    }
    const getDonutPriceHandler = async () => {
        const donutPrice = await VendingMachineContract.methods.donutPrice().call();
        setDonutPrice(donutPrice)
    }
    // Define a function to handle the setMyDonuts event from the VendingMachine contract
    const getMyDonutsHandler = async () => {
        // For this function, we actually need a specific address to get the donut balance for
        const count = await VendingMachineContract.methods.donutBalances(address).call();
        setMyDonuts(count)
    }

    const updateDonutQty = event => {
        setBuyCount(event.target.value)
    }
    // Define a function to handle the purchase method from the VendingMachine contract
    const buyDonutHandler = async () => {
        if (address) {
            try {
                const currentDonutPrice = await VendingMachineContract.methods.donutPrice().call();
                await VendingMachineContract.methods.purchase(buyCount).send({ 
                    from: address, 
                    value: buyCount * currentDonutPrice 
                });
                if (VendingMachineContract) {
                    getInventoryHandler()
                    getDonutPriceHandler()
                    if (address) {
                        getMyDonutsHandler()
                    }
                }
            } catch(error) {
                alert(error.message)
            }
        } else {
            alert("Please connect your MetaMask wallet to purchase donuts.")
        }
    }

    // Setup generic click handler for connect wallet button
    const connectWalletHander = async () => {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            if (address) {
                alert("You have already connected a wallet.")
            } else {
                try {
                    // Request wallet connect (the MetaMask account will be linked to the window, so no need to store as a constant)
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
                    // Setup Web3 instance
                    web3 = new Web3(window.ethereum);
    
                    // Set the MetaMask account state variable
                    const addresses = await web3.eth.getAccounts();
                    setAddress(addresses[0])
                    setWeb3(web3)

                    // Get contract instance
                    const vm = vendingMachineContract(web3)
                    setVendingMachineContract(vm)
                } catch (error) {
                    alert(error.message);
                }   
            }
        } else {
            // MetaMask is not installed
            alert('Please install MetaMask before using this dApp.\n\nhttps://metamask.io/');
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Blockchain Donuts Vending Machine</title>
                <meta name="description" content="A blockchain vending machine app." />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Blockchain Vending Machine</h1>
                    </div>
                    <div className="navbar-end">
                        <button onClick={connectWalletHander} className='button is-primary'>Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className='container'>
                    <h2>Vending Machine Inventory: {inventory}</h2>
                </div>
            </section>
            <section>
                <div className='container'>
                    <h2>My Donuts: {myDonuts}</h2>
                </div>
            </section>
            <section>
                <div className='container'>
                    <h2>Current Donut Price: {donutPrice} ({donutPrice / 1e18} ETH)</h2>
                </div>
            </section>
            <section className='mt-5'>
                <div className='container'>
                    <div className='field'>
                        <label className='label'>Buy Donuts</label>
                        <div className='control'>
                            <input onChange={updateDonutQty} className='input' type='number' placeholder='Enter amount...'/>
                        </div>
                        <button onClick={buyDonutHandler} className='button is-primary mt-2'>Buy</button>
                    </div>
                </div>
            </section>
            {/* <section>
                <div className='container has-text-success'>
                    <p>{purchaseStatus}</p>
                </div>
            </section> */}
        </div>
    );
}

export default VendingMachine