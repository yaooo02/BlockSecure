
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'; // Ensure wagmi is installed and configured

// ConnectionStatus Component
const ConnectionStatus: React.FC = () => {
  const { isConnected, isDisconnected } = useAccount();
  // const [status, setStatus] = useState<string>('Connecting...');
  const [, setStatus] = useState<string>('Connecting...');

  // Handle account change
  useEffect(() => {
    // check for the change in connected wallet account
    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Account changed:', accounts[0]);
      if (accounts.length == 0) {
        setStatus('Disconnected');
        alert('Disconnected from MetaMask.');
      } else {
        setStatus('Connected');
        alert(`Account changed to: ${accounts[0]}`);
      }
    };

    // check for the change in chain
    const handleChainChanged = (chainId: string) => {
        console.log('Network changed to:', chainId);
        if (chainId != '0x66eee') {
          setStatus('Disconnected');
          alert('Network changed or not supported.');
        } else {
          setStatus('Connected');
          alert('Network changed to Arbitrum Sepolia.');
        }
    };

    // subscribe to account changes and chain changes
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // cleanup subscription on component unmount
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };

  }, []);

  useEffect(() => {
    if (isConnected) {
      setStatus('Connected');
    } else if (isDisconnected) {
      setStatus('Disconnected');
    }
  }, [isConnected, isDisconnected]);

  return (
    <div>
      {isConnected ? (
          <>
            {/* If connected */}
            {/* <p>You are Connected to BlockSecure!</p> */}
          </>
        ) : (
          <>
            {/* If not connected, show the "Get Started" button */}
            <w3m-connect-button label="Get Started" loadingLabel="Connecting..." />
          </>
        )}
    </div>
  );
};

export default ConnectionStatus;
