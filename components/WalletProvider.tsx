import { PublicKey } from "@solana/web3.js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

type ConnectOpts = {
  onlyIfTrusted: boolean;
};

type PhantomProvider = {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
};

type WindowWithSolana = Window & {
  solana: PhantomProvider;
};

const hasSolana = (window: Window): window is WindowWithSolana => {
  return "solana" in window;
};

type WalletCtx =
  | null
  | {
      connect: () => void;
      publicKey: null;
    }
  | {
      publicKey: PublicKey;
      disconnect: () => void;
    };

const walletContext = createContext<WalletCtx>(null);

export const WalletProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [walletAvail, setWalletAvail] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [pubKey, setPubKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (!hasSolana(window) || !window.solana.isPhantom) {
      return;
    }

    setProvider(window.solana);
    setWalletAvail(true);
    window.solana.connect({ onlyIfTrusted: true });
  }, []);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.on("connect", (publicKey: PublicKey) => {
      console.log(`connect event: ${publicKey}`);
      setPubKey(publicKey);
    });
    provider.on("disconnect", () => {
      console.log("disconnect event");
      setPubKey(null);
    });
  }, [provider]);

  return (
    <walletContext.Provider
      value={
        !walletAvail
          ? null
          : pubKey
          ? {
              publicKey: pubKey,

              disconnect: () => {
                provider?.disconnect();
              },
            }
          : {
              publicKey: null,
              connect: () => {
                provider?.connect();
              },
            }
      }
    >
      {children}
    </walletContext.Provider>
  );
};

export const useWallet = () => useContext(walletContext);
