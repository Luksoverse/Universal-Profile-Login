import React, { useState } from 'react';
import './App.css';

import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

function App() {
  const [account, setAccount] = useState(undefined);
  const [data, setData] = useState({
    updated: false,
    nonce: undefined,
    signature: undefined
  });
  const [verificationData, setVerificationData] = useState(undefined);

  const connect = async () => {
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
  }
  const getNonce = async (publicAddress) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicAddress })
    };
    const nonce = await fetch('https://up-auth.herokuapp.com/nonce', requestOptions)
      .then(response => response.json())
      .then(data => data["nonce"]);
    return nonce;
  }
  const signNonce = async (publicAddress, nonce) => {
    const res = await web3.eth.sign(`${nonce}`, publicAddress);
    return res.signature;
  }
  const sign = async (publicAddress) => {
    const nonce = await getNonce(publicAddress);
    const signature = await signNonce(publicAddress, nonce);
    setData({ updated: true, nonce, signature })
  }
  const verifySignature = async (publicAddress, signature) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicAddress, signature })
    };
    const res = await fetch('https://up-auth.herokuapp.com/auth', requestOptions)
      .then(response => response.json());
    setVerificationData({ ...res });
  }

  return (
    <div className='btn-container'>
      <button onClick={() => connect()} className='btn connect'>Connect</button>
      <button onClick={() => sign(account)} className='btn sign'>Sign</button>
      <button onClick={() => verifySignature(account, data.signature)} className='btn verify'>Verify</button>
      {
        account
        ? <p className='account-data'>Account: {account}</p>
        : <></>
      }
      {
        data.updated
        ?
          <>
            <p className='account-data'>Nonce: {data.nonce}</p>
            <p className='account-data'>Signature: {data.signature}</p>
          </>
        : <></>
      }
      {
        verificationData !== undefined && verificationData.verified
        ? 
          <>
            <p className='account-data'>Your account is verified, this is indeed you Universal Profile.</p>
            <p className='account-data'>{verificationData.admin ? 'You are admin.' : 'You are not an admin.'}</p>
          </>
        : <></>
      }
    </div>
  );
}

export default App;
