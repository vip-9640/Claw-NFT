'use client';

import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import toast, { Toaster } from 'react-hot-toast';
import { getCollection } from '../lib/collection';
import { mintNFT } from '../lib/mintNFT';
import { sendNFT } from '../lib/sendNFT';
import { useNetworkConfig } from '../lib/walletProvider';
import Logo from '../components/Logo';

function truncateAddress(address) {
  return address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Not connected';
}

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { network, setNetwork } = useNetworkConfig();

  const [solBalance, setSolBalance] = useState(0);
  const [collection, setCollection] = useState([]);
  const [sortBy, setSortBy] = useState('mintedAt');
  const [theme, setTheme] = useState('dark');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [toAddress, setToAddress] = useState('');

  const owner = wallet.publicKey?.toBase58();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('claw-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  useEffect(() => {
    window.localStorage.setItem('claw-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    async function loadBalance() {
      if (!wallet.publicKey) {
        setSolBalance(0);
        return;
      }
      const lamports = await connection.getBalance(wallet.publicKey);
      setSolBalance(lamports / 1e9);
    }

    loadBalance().catch(() => setSolBalance(0));
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    setCollection(getCollection(owner));
  }, [owner]);

  const sortedCollection = useMemo(() => {
    const data = [...collection];
    if (sortBy === 'id') return data.sort((a, b) => a.id.localeCompare(b.id));
    if (sortBy === 'intensity') return data.sort((a, b) => b.intensity - a.intensity);
    return data.sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt));
  }, [collection, sortBy]);

  async function onMint() {
    if (!owner) return toast.error('Connect wallet first.');
    const toastId = toast.loading('Minting Claw NFT...');
    try {
      const nft = await mintNFT({ wallet, connection, owner });
      setCollection(getCollection(owner));
      toast.success(`Minted ${nft.id}`, { id: toastId });
    } catch (error) {
      toast.error(error.message || 'Mint failed', { id: toastId });
    }
  }

  async function onSendNFT() {
    if (!selectedNFT) return;
    const toastId = toast.loading('Sending NFT...');
    try {
      const res = await sendNFT({ nftId: selectedNFT.id, toAddress, wallet, connection });
      setCollection(getCollection(owner));
      toast.success('NFT sent successfully!', { id: toastId });
      if (res.signature) {
        toast((t) => (
          <span>
            Tx confirmed:&nbsp;
            <a
              href={`https://explorer.solana.com/tx/${res.signature}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
            >
              view on Explorer
            </a>
          </span>
        ));
      }
      setSelectedNFT(null);
      setToAddress('');
    } catch (error) {
      toast.error(error.message || 'Transfer failed', { id: toastId });
    }
  }

  return (
    <main className="container">
      <Toaster position="top-right" />
      <header className="header card">
        <Logo />
        <div className="row gap">
          <button className="btn ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <select value={network} onChange={(e) => setNetwork(e.target.value)} className="select">
            <option value="devnet">Devnet</option>
            <option value="mainnet-beta">Mainnet-ready</option>
          </select>
          <WalletMultiButton />
        </div>
      </header>

      <section className="dashboard card">
        <h2>Wallet Dashboard</h2>
        <div className="grid-3">
          <p><strong>Address:</strong> {truncateAddress(owner)}</p>
          <p><strong>Balance:</strong> {solBalance.toFixed(4)} SOL</p>
          <p><strong>Network:</strong> {network}</p>
        </div>
        <button className="btn" onClick={onMint}>Mint NFT</button>
      </section>

      <section className="card">
        <div className="row between">
          <h2>My Collection</h2>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
            <option value="mintedAt">Mint date</option>
            <option value="id">ID</option>
            <option value="intensity">Color intensity</option>
          </select>
        </div>
        <div className="nft-grid">
          {sortedCollection.map((nft) => (
            <article key={nft.id} className="nft-card">
              <div className="nft-art" style={{ background: nft.gradient }} />
              <h3>{nft.id}</h3>
              <p>Rarity: {nft.rarity}</p>
              <p>Intensity: {nft.intensity}</p>
              <p>Minted: {new Date(nft.mintedAt).toLocaleString()}</p>
              {nft.signature && (
                <a href={`https://explorer.solana.com/tx/${nft.signature}?cluster=devnet`} target="_blank" rel="noreferrer">
                  Mint Tx
                </a>
              )}
              <button className="btn small" onClick={() => setSelectedNFT(nft)}>Send NFT</button>
            </article>
          ))}
          {!sortedCollection.length && <p>No NFTs yet. Mint your first Claw NFT!</p>}
        </div>
      </section>

      {selectedNFT && (
        <div className="modal-backdrop" onClick={() => setSelectedNFT(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Send {selectedNFT.id}</h3>
            <input
              className="input"
              placeholder="Recipient wallet address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
            <div className="row gap">
              <button className="btn" onClick={onSendNFT}>Confirm Send</button>
              <button className="btn ghost" onClick={() => setSelectedNFT(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Claw NFT • Running on {network}</p>
        <a href="https://solana.com/docs/intro/quick-start/writing-to-network" target="_blank" rel="noreferrer">
          Solana Devnet Docs
        </a>
      </footer>
    </main>
  );
}
