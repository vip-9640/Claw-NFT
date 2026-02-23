import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { AppWalletProvider } from '../lib/walletProvider';

export const metadata = {
  title: 'Claw NFT',
  description: 'Solana Devnet colored-box NFT dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
