import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css'
// @ts-ignore
import { fetchAssetTransfers } from './TransactionHistoryChecking.js';
// @ts-ignore
import { fetchScamsYaml } from './scamUtils.js';
import NoBalanceTransactionModal from './ModalAlert.tsx';
import ScamListModal from './ModalFraudDetected.tsx';


const TransactionForm = () => {
  // States for handling the transaction form and modal
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); 
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState<boolean>(false);
  // const [isFraudulent, setIsFraudulent] = useState<boolean | null>(null);
  const [, setIsFraudulent] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isAmountValid, setIsAmountValid] = useState<boolean | null>(null);
  const [isTransactionDone, setIsTransactionDone] = useState<boolean>(false);
  // const [transactionHistoryCount, setTransactionHistoryCount] = useState<number | null>(null);
  const [, setTransactionHistoryCount] = useState<number | null>(null);


  const [isNoBalanceOpen, setIsNoBalanceOpen] = useState(false);
  const [isScamListOpen, setIsScamListOpen] = useState(false);

  // Handle input change for the recipient address and validate it
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddress = e.target.value;
    setRecipientAddress(inputAddress);
    // Validate the address
    if (ethers.utils.isAddress(inputAddress)) {
      setIsValid(true);
    } else if (inputAddress == '') {
      setIsValid(null);
    } else {
      setIsValid(false);
    }
  };

  // Handle input change for the amount and validate it
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);
    // Validate the amount (check if it's a positive number)
    const parsedAmount = parseFloat(inputAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setIsAmountValid(true);
    } else if (inputAmount === '') {
      setIsAmountValid(null);
    } else {
      setIsAmountValid(false); 
    }
  };

  // Check recipient's balance and transaction history
const checkBalanceAndHistory = async (address: string): Promise<boolean> => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const historyCount = await fetchAssetTransfers(address);
    setTransactionHistoryCount(historyCount);

    if (historyCount === 0) {
      // Show No Balance or Transaction History modal
      setIsNoBalanceOpen(true); // Open NoBalanceTransactionModal
      return true;
    }

    const balance = await provider.getBalance(address);
    if (balance.isZero()) {
      // Show No Balance modal
      setIsNoBalanceOpen(true); // Open NoBalanceTransactionModal
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking recipient address:', error);
    return true;
  }
};

  // Check recipient address to identify if listed in scam list
const checkScamList = async (address: string): Promise<boolean> => {
  try {
    const scamList = await fetchScamsYaml();
    const isScam = scamList.some((scam: any) => {
      if (scam.addresses && Array.isArray(scam.addresses)) {
        const match = scam.addresses.includes(address);
        if (match) {
          // Show Scam List modal
          setIsScamListOpen(true); // Open ScamListModal
          return true;
        }
      }
      return false;
    });
    return isScam;
  } catch (error) {
    console.error('Error checking scam list:', error);
    return false;
  }
};

  // Flag the address as fraud if existed in the scam list
  const checkFraudulentAddress = async (address: string): Promise<boolean> => {
    try {
      // Check if the address is in the scam list
      const isScam = await checkScamList(address);
      return isScam;
    } catch (error) {
      console.error('Error checking fraudulent address:', error);
      return false;
    }
  };

  // Handle sending the transaction
  const handleSendTransaction = async () => {
    setError(null);
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install it to use this dApp.');
      return;
    }
    if (!ethers.utils.isAddress(recipientAddress)) {
      setError('Invalid recipient address');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check if the recipient address is flagged as fraudulent
    const fraudulent = await checkFraudulentAddress(recipientAddress);
    setIsFraudulent(fraudulent);
    if (fraudulent) {
      setError('The recipient address has been flagged as fraudulent. Transaction aborted.');
      return;
    }

    // Perform balance and history checks
    await checkBalanceAndHistory(recipientAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amount),
      };
      const txResponse = await signer.sendTransaction(tx);
      setTransactionHash(txResponse.hash);
      setIsTransactionPending(true);

      provider.once(txResponse.hash, () => {
        setIsTransactionPending(false);
        setIsTransactionDone(true);
      });
    } catch (error) {
      // console.error('Error sending transaction:', error);
      setError('Transaction failed. Please try again.');
    }
  };

  // Reset form fields and states
  const handleReset = () => {
    setRecipientAddress('');
    setAmount('');
    setTransactionHash(null);
    setIsTransactionPending(false);
    setIsTransactionDone(false);
    setError(null);
    setIsFraudulent(null);
    setIsValid(null);
    setIsAmountValid(null);
    setTransactionHistoryCount(null);
  };

  const handleDone = () => {
    handleReset();
  };

  return (
    <div className='transaction-section'>
      <h3>Make New Transactions</h3>
  
      {!isTransactionDone ? (
        <>
          <div className='input-field'>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={handleInputChange}
              className='input-box'
            />
            {isValid === false && <p className='alert-text'>Invalid recipient address, please check again.</p>}
          </div>
  
          <div className='input-field'>
            <input
              type="text"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={handleAmountChange}
              className='input-box'
            />
            {isAmountValid === false && <p className='alert-text'>Please enter a valid amount greater than 0.</p>}
          </div>

          <div className='send-reset-field'>
            <button onClick={handleSendTransaction} className='fetchBtn'>
              {isTransactionPending ? 'Transaction Pending...' : 'Send Transaction'}
            </button>

            {/* Reset button */}
            <a onClick={handleReset} className='resetBtn'>
              Reset
            </a>
          </div>

          {/* Show if any error message */}
          {error && <p className='alert-text'>{error}</p>}

        </>
      ) : (
        <div>
          <div className='success-notification'>
            <p className='inform-text'>
              Transaction completed with hash:{' '}
              <a href={`https://sepolia.arbiscan.io/tx/${transactionHash}`} target="_blank" rel="noreferrer" className='transaction-link'>
                {transactionHash}
              </a>
            </p>
            {/* Now this button will be displayed */}
            <button onClick={handleDone} id='doneBtn' className='show'>
              Done
            </button>
          </div>
        </div>
      )}

      {/* No Balance or Transaction History Modal */}
      {isNoBalanceOpen && (
        <NoBalanceTransactionModal
          title="No Balance or Transaction History"
          message={`Address ${recipientAddress} has no balance or transaction history.`}
          onClose={() => {
            setIsNoBalanceOpen(false);
          }}
        />
      )}

      {/* Scam List Detected Modal */}
      {isScamListOpen && (
        <ScamListModal
          title="Scam Alert"
          message={`The address ${recipientAddress} is listed in the scam list. Transaction aborted.`}
          onClose={() => {
            handleReset();  // Reset the form when modal closes
            setIsScamListOpen(false);
          }}
        />
      )}

    </div>
  );
};

export default TransactionForm;
