import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { upsertNFT } from './collection';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function buildColorSpec() {
  const c1 = [randomInt(256), randomInt(256), randomInt(256)];
  const c2 = [randomInt(256), randomInt(256), randomInt(256)];
  const gradient = `linear-gradient(135deg, rgb(${c1.join(',')}), rgb(${c2.join(',')}))`;
  const intensity = Math.round((c1.reduce((a, b) => a + b, 0) + c2.reduce((a, b) => a + b, 0)) / 6);
  const rarity = intensity > 190 ? 'Bright Rare' : intensity > 130 ? 'Pastel Uncommon' : 'Deep Common';
  return { c1, c2, gradient, intensity, rarity };
}

// Simulated NFT mint that stores metadata locally and anchors a memo transaction on Solana.
export async function mintNFT({ wallet, connection, owner }) {
  const { c1, c2, gradient, intensity, rarity } = buildColorSpec();
  const id = `CLAW-${Date.now()}-${randomInt(9999)}`;
  const mintedAt = new Date().toISOString();

  let signature = null;
  if (wallet?.sendTransaction && wallet.publicKey) {
    const memo = `Claw NFT Mint ${id}`;
    const tx = new Transaction().add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(memo, 'utf-8')
      })
    );
    signature = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'confirmed');
  }

  const nft = {
    id,
    owner,
    mintedAt,
    colorA: `rgb(${c1.join(',')})`,
    colorB: `rgb(${c2.join(',')})`,
    gradient,
    intensity,
    rarity,
    signature
  };

  upsertNFT(nft);
  return nft;
}
