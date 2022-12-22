import { useEffect, useState } from "react";
import { useWallet } from "./WalletProvider";

type TokenSelectorInputProps = {
  value: string | null;
  onChange: (mint: string) => void;
};

type TokenInfo = {
  mint: string;
  symbol: string;
  amount: number;
};

export const TokenSelectorInput = ({
  value,
  onChange,
}: TokenSelectorInputProps): JSX.Element | null => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);

  const wallet = useWallet();

  useEffect(() => {
    if (!wallet || !wallet.publicKey) {
      return;
    }

    // TODO... get balances
    // TODO... utl get info
  }, [wallet]);

  if (!wallet || !wallet.publicKey) {
    return null;
  }

  return (
    <div>
      {tokens.map((token) => {
        return (
          <div
            key={token.mint}
            onClick={() => {
              onChange(token.mint);
            }}
          >
            <div>{token.symbol}</div>
            <div>{token.amount}</div>
          </div>
        );
      })}
    </div>
  );
};
