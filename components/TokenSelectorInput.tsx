import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, ParsedAccountData } from "@solana/web3.js";
import { Client, UtlConfig } from "@solflare-wallet/utl-sdk";
import { Cluster } from "@streamflow/stream";

import { useWallet } from "./WalletProvider";

const CHAIN_ID = {
  [Cluster.Mainnet]: 101,
  [Cluster.Testnet]: 102,
  [Cluster.Devnet]: 103,
} as const;

const utl = new Client(
  new UtlConfig({
    chainId: CHAIN_ID["devnet"],
    connection: new Connection(clusterApiUrl("devnet")),
  })
);

const solanaDev = new Connection(clusterApiUrl("devnet"));

type TokenInfo = {
  mint: string;
  symbol: string;
  amount: string;
};

type TokenSelectorInputProps = {
  value: string | null;
  onChange: (mint: string) => void;
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

    const fetchTokensInfo = async () => {
      const programAccounts = await solanaDev.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: wallet.publicKey.toBase58(),
              },
            },
          ],
        }
      );

      const tokens = await Promise.all(
        programAccounts.map(async (tokenAccount): Promise<TokenInfo> => {
          const splMint = (tokenAccount.account.data as ParsedAccountData)
            .parsed.info.mint;

          const tokenInfo = await utl.fetchMint(splMint);

          const tokenBalance = await solanaDev.getTokenAccountBalance(
            tokenAccount.pubkey
          );

          return {
            mint: splMint,
            amount: tokenBalance.value.amount, // TODO this is not correct :(
            symbol: tokenInfo.symbol,
          };
        })
      );

      setTokens(tokens);
    };

    fetchTokensInfo();
  }, [wallet]);

  if (!wallet || !wallet.publicKey) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {tokens.map((token) => {
        return (
          <div
            key={token.mint}
            style={{
              fontWeight: value === token.mint ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => {
              onChange(token.mint);
            }}
          >
            {token.symbol}: {token.amount}
          </div>
        );
      })}
    </div>
  );
};
