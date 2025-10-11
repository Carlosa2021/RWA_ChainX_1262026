"use client";

import {
  ConnectButton,
  useActiveAccount,
  useDisconnect,
} from "thirdweb/react";
import { client, chain } from "@/lib/thirdweb";
import { createWallet } from "thirdweb/wallets";

// Configure wallets
const wallets = [
  // In-App Wallets (Email, Social, Passkeys)
  createWallet("inApp", {
    auth: {
      options: [
        "email",
        "google",
        "apple",
        "facebook",
        "phone",
        "passkey",
      ],
    },
  }),
  // External wallets
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const account = useActiveAccount();

  return (
    <div className={className}>
      <ConnectButton
        client={client}
        chain={chain}
        wallets={wallets}
        theme="dark"
        connectButton={{
          label: "Conectar Wallet",
          className: "connect-button",
        }}
        connectModal={{
          title: "Conectar a RWA InmoToken",
          titleIcon: "",
          showThirdwebBranding: false,
          size: "compact",
        }}
        detailsButton={{
          displayBalanceToken: {
            [chain.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC
          },
        }}
      />
      
      {account && (
        <div className="wallet-info mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">Conectado</p>
          <p className="font-mono text-sm">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}

// Hook for easy wallet access
export function useWallet() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();

  return {
    address: account?.address,
    isConnected: !!account,
    disconnect,
  };
}
