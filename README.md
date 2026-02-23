# Claw NFT (Solana Devnet)

Claw NFT is a production-structured React/Next.js Solana Web3 app for minting and managing **programmatically generated colored-box NFTs**.

## Features

- Multi-wallet support via Solana wallet adapter ecosystem:
  - Phantom, Solflare, Backpack, Slope, Torus, Ledger
- Devnet-first with a **network switch** (Mainnet-ready toggle)
- Wallet connect/disconnect UI
- Wallet address + SOL balance display
- Mint NFT flow with random gradient color generation and rarity scoring
- Local metadata collection rendering in a responsive animated grid
- Sort collection by mint date, ID, intensity
- Send NFT modal with recipient validation + memo transaction anchoring
- Toast notifications for pending/success/error states
- Solana Explorer links for transaction signatures
- Light/dark theme toggle
- Placeholder generated Claw NFT logo

## Project Structure

- `app/`
  - `layout.js`: global providers + Solana wallet UI styles
  - `page.js`: main dashboard UI, mint/send flows, collection rendering
  - `globals.css`: theme system + animations + responsive styles
- `components/`
  - `Logo.js`: generated placeholder app logo
- `lib/`
  - `walletProvider.js`: Solana connection + wallets + network context
  - `mintNFT.js`: random colored-box NFT generator + memo mint transaction
  - `collection.js`: local collection storage/queries
  - `sendNFT.js`: NFT transfer logic + memo transaction + owner update

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Devnet Usage

1. Connect a wallet from the wallet modal.
2. Ensure network is set to **Devnet**.
3. Get devnet SOL from a faucet if balance is low.
4. Click **Mint NFT** to create a colored-box NFT (saved locally and memo-published).
5. Use **Send NFT** on any item to transfer ownership to another address.

## Notes

- This app uses **local metadata storage** for fast iteration/demo workflows.
- It publishes memo transactions to Solana for verifiable action signatures.
- For full on-chain NFT minting (Metaplex token metadata + mint account), extend `mintNFT.js` with SPL Token + Metaplex flows.

