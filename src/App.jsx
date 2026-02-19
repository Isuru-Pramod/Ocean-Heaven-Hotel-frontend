import CreateAsset from "./components/CreateAsset";
import BuyShares from "./components/BuyShares";
import TransferShares from "./components/TransferShares";
import AssetDashboard from "./components/AssetDashboard";

// function App() {
//   return (
//     <div>
//       <h1>Ocean Heaven Tokenized Real Estate</h1>
//       <CreateAsset />
//       <BuyShares />
//       <TransferShares />
//       <AssetDashboard />
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

const API = "http://localhost:5000";

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [wallet, setWallet] = useState("");
  const [response, setResponse] = useState("");

  // CONNECT METAMASK

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    setWallet(accounts[0]);
  };

  // LOGIN
  const login = async () => {
    const res = await axios.post(`${API}/auth/login`, {
      email: "admin1@gmail.com",     // Change for testing
      password: "123456"
    });

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setResponse("Logged in");
  };

  // CREATE ASSET (ADMIN)

  const createAsset = async () => {

    const res = await axios.post(
      `${API}/asset/create`,
      {
        name: "Colombo Tower",
        location: "Colombo",
        total_shares: 100,
        share_price: ethers.parseEther("0.01").toString()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    await signTransaction(res.data.tx);
  };

  // BUY PRIMARY SHARES

  const buyPrimary = async () => {

    const sharePrice = ethers.parseEther("0.01");
    const amount = 2;
    const totalValue = sharePrice * BigInt(amount);

    const res = await axios.post(
      `${API}/asset/buy-primary`,
      {
        asset_id: 1,
        amount: amount,
        share_price: sharePrice.toString()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    await signTransaction(res.data.tx, totalValue);
  };

  // SELL SHARES

  const sellShares = async () => {

    const res = await axios.post(
      `${API}/asset/sell`,
      {
        asset_id: 1,
        amount: 1,
        price_per_share: ethers.parseEther("0.02").toString()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    await signTransaction(res.data.tx);
  };

  // BUY LISTED SHARES

  const buyListing = async () => {

    const pricePerShare = ethers.parseEther("0.02");
    const amount = 1;
    const totalValue = pricePerShare * BigInt(amount);

    const res = await axios.post(
      `${API}/asset/buy-listing`,
      {
        listing_id: 1,
        amount: amount,
        price_per_share: pricePerShare.toString()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    await signTransaction(res.data.tx, totalValue);
  };


  // SIGN TRANSACTION

  const signTransaction = async (tx, value = 0) => {

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const txResponse = await signer.sendTransaction({
      to: tx.to,
      data: tx.data,
      value: value ? value : tx.value || 0,
      gasLimit: tx.gas
    });

    await txResponse.wait();

    setResponse("Transaction Success: " + txResponse.hash);
  };

  // VIEW ASSET

  const viewAsset = async () => {
    const res = await axios.get(`${API}/asset/1`);
    setResponse(JSON.stringify(res.data, null, 2));
  };

  const viewListing = async () => {
    const res = await axios.get(`${API}/asset/listing/1`);
    setResponse(JSON.stringify(res.data, null, 2));
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Real Estate Marketplace Test Dashboard</h1>

      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Wallet: {wallet}</p>

      <hr />

      <button onClick={login}>Login</button>

      <hr />

      <button onClick={createAsset}>Create Asset (Admin)</button>
      <button onClick={buyPrimary}>Buy Primary Shares</button>
      <button onClick={sellShares}>Sell Shares</button>
      <button onClick={buyListing}>Buy Listed Shares</button>

      <hr />

      <button onClick={viewAsset}>View Asset</button>
      <button onClick={viewListing}>View Listing</button>

      <hr />

      <pre>{response}</pre>
    </div>
  );
}

export default App;

