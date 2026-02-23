import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { updateNFTOwner } from './collection';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

// Sends (transfers) a local NFT by changing ownership and writing a memo tx to Devnet.
export async function sendNFT({ nftId, toAddress, wallet, connection }) {
  const recipient = new PublicKey(toAddress);
  if (!wallet?.publicKey || !wallet?.sendTransaction) {
    throw new Error('Connect a wallet before sending NFTs.');
  }

  const tx = new Transaction().add(
    new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [{ pubkey: recipient, isSigner: false, isWritable: false }],
      data: Buffer.from(`Claw NFT Transfer ${nftId} to ${toAddress}`, 'utf-8')
    })
  );

  const signature = await wallet.sendTransaction(tx, connection);
  await connection.confirmTransaction(signature, 'confirmed');

  const updated = updateNFTOwner(nftId, recipient.toBase58());
  return { signature, updated };
}
