// SETTING UP
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// project ID from https://cloud.walletconnect.com/
const projectId = 'f2f77c287d30f2fe57d1b5d9d985aea7'

// the chain to be used will be arbitrumSepolia
const chains = [arbitrumSepolia] as const

// metadata and config about this dApp
const metadata = {
  name: 'JY-BlockSecure-ArbitrumSepolia-Project',
  description: 'Arbitrum Sepolia Fraud Detection',
  url: '', // origin must match your domain & subdomain 'https://web3modal.com'
  icons: [] //'https://avatars.githubusercontent.com/u/37784886'
}


const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata
})

// create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // can rack the user activities
  enableOnramp: false
})

// setup queryClient
const queryClient = new QueryClient();

// API for manage and optimize rendering of React app, fetching DOM element with ID 'root'
// .render() to render actual components to DOM [ everything in this method will render to #root in HTML]
createRoot(document.getElementById('root')!).render(
  // helps to identify potential problem in React app
  <StrictMode>
    {/* <Wagmi Provider> provides React hooks to manage Ethereum or wallet */}
    <WagmiProvider config={config}>
      {/* managing server-side data in React, give access to React Query for data fetching, caching, synchronizing and updating */}
      <QueryClientProvider client={queryClient}>
        {/* main component of the React app */}
        <App /> 
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)