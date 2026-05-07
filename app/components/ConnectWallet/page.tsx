'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log('✅ Connected account:', accounts[0]);
      } catch (err) {
        console.error('❌ Wallet connection failed:', err);
      }
    } else {
      alert('🦊 MetaMask not detected. Please install it.');
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <div className="flex items-center gap-4 mb-4">
      {account ? (
        <span className="text-sm text-green-600">🔐 Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
