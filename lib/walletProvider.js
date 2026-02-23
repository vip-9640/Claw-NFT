'use client';

import { useMemo, useState, createContext, useContext, useEffect } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets';

const NetworkContext = createContext();

export function useNetworkConfig() {
  return useContext(NetworkContext);
}

// Global wallet + network provider for the app.
export function AppWalletProvider({ children }) {
  const [network, setNetwork] = useState('devnet');

  useEffect(() => {
    const saved = window.localStorage.getItem('claw-network');
    if (saved) setNetwork(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('claw-network', network);
  }, [network]);

  const endpoint = useMemo(
    () => (network === 'mainnet-beta' ? clusterApiUrl('mainnet-beta') : clusterApiUrl('devnet')),
    [network]
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    []
  );

  const value = useMemo(() => ({ network, setNetwork, endpoint }), [network, endpoint]);

  return (
    <NetworkContext.Provider value={value}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </NetworkContext.Provider>
  );
}
