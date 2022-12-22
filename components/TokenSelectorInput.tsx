import { useEffect, useState } from "react";

type TokenSelectorInputProps = {
  value: string | null;
  onChange: (mint: string) => void;
};

export const TokenSelectorInput = ({
  value,
  onChange,
}: TokenSelectorInputProps): JSX.Element => {
  const [selectedMint, setSelectedMint] = useState<string | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    // TODO... get balances
    // TODO... utl get info
  }, []);

  return (
    <div>
      {tokens.map((token, idx) => {
        return (
          <div key={idx}>
            <div>logo</div>
            <div>name/symbol</div>
            <div>amount</div>
          </div>
        );
      })}
    </div>
  );
};
