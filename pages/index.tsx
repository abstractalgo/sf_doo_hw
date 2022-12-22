import Head from "next/head";

import {
  StreamClient,
  Stream,
  CreateParams,
  CreateMultiParams,
  WithdrawParams,
  TransferParams,
  TopupParams,
  CancelParams,
  GetAllParams,
  StreamDirection,
  StreamType,
  Cluster,
  TxResponse,
  CreateResponse,
  BN,
  getBN,
  getNumberFromBN,
} from "@streamflow/stream";
import { useEffect } from "react";
import { WalletConnector } from "../components/WalletConnector";
// import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Connection } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export default function Home() {
  // const w = useWallet();

  useEffect(() => {
    const doSomething = async () => {
      const publicKey = new PublicKey(
        "9U3CcDLVgFxH8z7QYiEjxRgimrKM9yT8XWRvWm3SqnoE"
      );
      // const solana = new Connection("https://api.devnet.solana.com/");
      // const balance = await solana.getBalance(publicKey);
      // const parsed = await solana.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      //   filters: [
      //     {
      //       dataSize: 165, // number of bytes
      //     },
      //     {
      //       memcmp: {
      //         offset: 32, // number of bytes
      //         bytes: publicKey.toBase58(), // base58 encoded string
      //       },
      //     },
      //   ],
      // });
      // // const tokBalance = await solana.getTokenAccountBalance(publicKey);
      // const tokAccs = await solana.getTokenAccountsByOwner(publicKey, {
      //   mint: new PublicKey(
      //     "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
      //   ),
      // });

      // console.log({ balance, parsed, tokAccs });

      const client = new StreamClient(
        "https://api.devnet.solana.com/",
        Cluster.Devnet,
        "confirmed"
      );

      const rv = await client.get({
        wallet: publicKey,
      });

      console.log({ rv });

      //     await fetch('https://api.devnet.solana.com/', {
      //       method: 'POST',
      //       headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(
      //     {
      //       jsonrpc: "2.0",
      //       id: 1,
      //       method: "getTokenAccountsByOwner",
      //       params: [
      //         ,
      //         {
      //           mint: 'DNw99999M7e24g99999999WJirKeZ5fQc6KY999999gK',
      //         },
      //         {
      //           encoding: "jsonParsed",
      //         },
      //       ],
      //     },
      // )
      //     })

      //   const createStreamParams: CreateParams = {
      //     sender: wallet, // Wallet/Keypair signing the transaction, creating and sending the stream.
      //     recipient: "4ih00075bKjVg000000tLdk4w42NyG3Mv0000dc0M00", // Solana recipient address.
      //     mint: "DNw99999M7e24g99999999WJirKeZ5fQc6KY999999gK", // SPL Token mint.
      //     start: 1643363040, // Timestamp (in seconds) when the stream/token vesting starts.
      //     depositedAmount: getBN(1000000000000, 9), // Deposited amount of tokens (using smallest denomination).
      //     period: 1, // Time step (period) in seconds per which the unlocking occurs.
      //     cliff: 1643363160, // Vesting contract "cliff" timestamp in seconds.
      //     cliffAmount: new BN(100000000000), // Amount (smallest denomination) unlocked at the "cliff" timestamp.
      //     amountPerPeriod: getBN(5000000000, 9), // Release rate: how many tokens are unlocked per each period.
      //     name: "Transfer to Jane Doe.", // The stream name or subject.
      //     canTopup: false, // setting to FALSE will effectively create a vesting contract.
      //     cancelableBySender: true, // Whether or not sender can cancel the stream.
      //     cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
      //     transferableBySender: true, // Whether or not sender can transfer the stream.
      //     transferableByRecipient: false, // Whether or not recipient can transfer the stream.
      //     automaticWithdrawal: true, // [WIP] Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
      //     withdrawalFrequency: 10, // [WIP] Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
      //     partner: null, //  (optional) Partner's wallet address (string | null).
      //   };

      //   try {
      //     const { ixs, tx, metadata } = await client.create(createStreamParams);
      //   } catch (exception) {
      //     // handle exception
      //   }

      //   try {
      //     const streams = client.get({
      //       wallet: wallet, // Wallet signing the transaction.
      //       type: StreamType.All, // (optional) Type, default is StreamType.All
      //       direction: StreamDirection.All, // (optional) Direction, default is StreamDirection.All)
      //     });
      //   } catch (exception) {
      //     // handle exception
      //   }
    };

    doSomething();
  }, []);

  return (
    <>
      <Head>
        <title>sf domaci</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* <button
          onClick={async () => {
            await wallet.connect();
          }}
        >
          connect
        </button> */}

        {/* <div>{wallet.connected ? wallet.publicKey?.toString() : "none"}</div> */}
        <WalletConnector />
      </main>
    </>
  );
}
