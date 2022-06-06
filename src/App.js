import React, { useState } from 'react';
import './App.css';

import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

function App() {

  const [account, setAccount] = useState(undefined);

  const connect = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts);
    setAccount(accounts[0]);
  }
  const getNonce = async (publicAddress) => {
    console.log(account);
    console.log(publicAddress);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicAddress })
    };
    const nonce = await fetch('https://up-auth.herokuapp.com/nonce', requestOptions)
      .then(response => response.json())
      .then(data => data["nonce"]);
    alert(nonce);
    console.log(nonce);
    //signNonce(nonce, publicAddress);
  }
  const signNonce = async (nonce, publicAddress) => {
    web3.eth.personal.sign(`${nonce}`, publicAddress, (err, res) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
      /*if (!err) {
        verifySignature(publicAddress, res);
      }*/
    });
  }

  return (
    <div className='btn-container'>
      <button onClick={() => connect()} className='btn connect'>Connect</button>
      <button onClick={() => getNonce(account)} className='btn sign'>Sign</button>
      <button className='btn verify'>Verify</button>
    </div>
  );
}

export default App;
