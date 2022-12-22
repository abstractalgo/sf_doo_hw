import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

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

// based on https://medium.com/@jorge.londono_31005/intro-to-solana-webapp-development-with-react-typescript-phantom-ca2724d1fa22
export const WalletConnector = (): JSX.Element => {
  const [walletAvail, setWalletAvail] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [pubKey, setPubKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (!hasSolana(window) || !window.solana.isPhantom) {
      return;
    }

    setProvider(window.solana);
    setWalletAvail(true);
    // Attemp an eager connection
    window.solana.connect({ onlyIfTrusted: true });
  }, []);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.on("connect", (publicKey: PublicKey) => {
      console.log(`connect event: ${publicKey}`);
      setConnected(true);
      setPubKey(publicKey);
    });
    provider.on("disconnect", () => {
      console.log("disconnect event");
      setConnected(false);
      setPubKey(null);
    });
  }, [provider]);

  const connectHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    console.log(`connect handler`);
    provider?.connect().catch((err) => {
      console.error("connect ERROR:", err);
    });
  };

  const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    console.log("disconnect handler");
    provider?.disconnect().catch((err) => {
      console.error("disconnect ERROR:", err);
    });
  };

  return (
    <div>
      {walletAvail ? (
        <>
          <button disabled={connected} onClick={connectHandler}>
            Connect to Phantom
          </button>
          <button disabled={!connected} onClick={disconnectHandler}>
            Disconnect from Phantom
          </button>
          {connected ? <p>Your public key is : {pubKey?.toBase58()}</p> : null}
        </>
      ) : (
        <>
          <p>
            Opps!!! Phantom is not available. Go get it{" "}
            <a href="https://phantom.app/">https://phantom.app/</a>.
          </p>
        </>
      )}
    </div>
  );
};
