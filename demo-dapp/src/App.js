import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

const greeterAddress = '0x0E076fe5B8f18e4d7cBDA11ecf6b042C3B4C2484'
const tokenAddress = '0xf8a6407B2D73BAFdb10f6F4Bc13D6D23F15F3d01'
//Local
//Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
//Token deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
//Ropsten
// Greeter deployed to: 0x0E076fe5B8f18e4d7cBDA11ecf6b042C3B4C2484
//                 old: 0x20723Cb5e59db62CEFB3f105954b4Ed87E1C49E8
// Token deployed to: 0xf8a6407B2D73BAFdb10f6F4Bc13D6D23F15F3d01

function App() {
  const [greeting, setGreetingValue] = useState('')
  const [wallet, setWallet] = useState()
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (!wallet) requestAccount()
  }, [])

  const requestAccount = async () => {
    const res = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setWallet(res[0])
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      console.log('contract: ', contract)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  const setGreeting = async () => {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      console.log('Signer: ', await signer.getAddress() )
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      console.log('Contract: ', contract)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
      setGreeting('')
    }
  }

  const sendCoins = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
      setUserAccount('')
      setAmount('')
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>{`Wallet Address: ${wallet}`}</div>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input value={userAccount} onChange={e => setUserAccount(e.target.value)} placeholder="Wallet Address" />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
