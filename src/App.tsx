// SETTING UP
import { useEffect } from 'react'
import './App.css'
import { useAccount } from 'wagmi'
import ConnectionStatus from './ConnectStatus.tsx'
import FraudDetection from './fraudDetect.tsx'

// DESIGN OF THE SYSTEM?
function App() {
  // // get connected user account / current account
  const { isConnected } = useAccount();
  // // Optionally, add some state to manage loading or further UI behavior
  // const [status, setStatus] = useState('Connecting...');
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    } else {
      console.warn('Notifications are not supported in this browser.');
    }
  };
  
  useEffect(() => {
    requestNotificationPermission();
  }, []);  

  return (
    <>
    {/* Display the header of React app */}
    <header>
      <w3m-network-button />
      <h2>BlockSecure</h2>
      <w3m-button label='Connect Now' loadingLabel='Connecting...' balance='show'/>
    </header>

    <div className='content'>
      {/* Title and buttons for dApp */}
      <h1>Securing Your Transactions with BlockSecure</h1>
      <ConnectionStatus />

      {/* Slogan for dAPP */}
      <div className='slogan'>
      <p>An advanced fraud detection platform leveraging blockchain to reduce financial fraud and ensure the security of your digital transactions </p>
      </div>
      
      {/* <p>Current balance: {data?.formatted} {data?.symbol} </p>  */}

      {/* Display pending transactions */}
      {isConnected &&
        <div className='processSection'>
          <FraudDetection />
        </div>
      }

    </div>
    </>
  )
}

export default App
