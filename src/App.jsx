import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";

const API = "http://localhost:5000";

function App() {
  const [wallet, setWallet] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [response, setResponse] = useState("");
  const [assets, setAssets] = useState([]);        // start with empty array
  const [listings, setListings] = useState([]);

  // CONNECT METAMASK

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setResponse("Failed to connect wallet: " + err.message);
    }
  };

  // LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: "admin1@gmail.com",
        password: "123456"
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setResponse("Logged in successfully");
    } catch (e) {
      setResponse("Login failed: " + (e.response?.data?.message || e.message));
    }
  };

  // ASSET FUNCTIONS
  const createAsset = async () => {
    try {
      const res = await axios.post(
        `${API}/asset/create`,
        {
          name: "Colombo Tower",
          location: "Colombo",
          description: "Luxury tower in Colombo",
          image_url: "https://YOUR_SUPABASE_IMAGE_URL",
          total_shares: 100,
          share_price: ethers.parseEther("0.01").toString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await signTransaction(res.data.tx);
    } catch (e) {
      setResponse("Create asset failed: " + (e.response?.data?.message || e.message));
    }
  };

  const updateAsset = async (asset_id) => {
    try {
      const res = await axios.put(
        `${API}/asset/update`,
        {
          asset_id,
          name: "Updated Tower for testing",
          location: "Colombo",
          description: "Updated description for test",
          image_url: "https://hrarchz.com/wp-content/uploads/2021/12/01-1-1200x675.jpg",
          share_price: ethers.parseEther("0.015").toString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await signTransaction(res.data.tx);
    } catch (e) {
      setResponse("Update asset failed: " + (e.response?.data?.message || e.message));
    }
  };


  const deleteAsset = async (asset_id) => {
    try {
      const res = await axios.post(
        `${API}/asset/delete`,
        { asset_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await signTransaction(res.data.tx);
    } catch (e) {
      setResponse("Delete asset failed: " + (e.response?.data?.message || e.message));
    }
  };

  // PRIMARY MARKET FUNCTIONS

  const buyPrimary = async (asset_id, amount, price_per_share) => {
    try {
      const totalValue = BigInt(amount) * BigInt(price_per_share);
      const res = await axios.post(
        `${API}/asset/buy-primary`,
        { asset_id, amount, share_price: price_per_share },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await signTransaction(res.data.tx, totalValue);
    } catch (e) {
      setResponse("Buy primary failed: " + (e.response?.data?.message || e.message));
    }
  };

  // MARKETPLACE FUNCTIONS

  const sellShares = async (asset_id, amount, price_per_share) => {
    try {
      const res = await axios.post(
        `${API}/asset/sell`,
        { asset_id, amount, price_per_share },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await signTransaction(res.data.tx);
    } catch (e) {
      setResponse("Sell shares failed: " + (e.response?.data?.message || e.message));
    }
  };

  const buyListing = async (listing_id, amount, price_per_share) => {
    try {
      const totalValue = BigInt(amount) * BigInt(price_per_share);
      const res = await axios.post(
        `${API}/asset/buy-listing`,
        { listing_id, amount, price_per_share },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await signTransaction(res.data.tx, totalValue);
    } catch (e) {
      setResponse("Buy listing failed: " + (e.response?.data?.message || e.message));
    }
  };


  // SIGN TRANSACTION
  // ==============================
  const signTransaction = async (tx, value = 0n) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const txResponse = await signer.sendTransaction({
        to: tx.to,
        data: tx.data,
        value: value || tx.value || 0n,
        gasLimit: tx.gas
      });

      await txResponse.wait();
      setResponse("Transaction success: " + txResponse.hash);
    } catch (e) {
      setResponse("Transaction failed: " + e.message);
    }
  };

  // ==============================
  // VIEW ASSETS & LISTINGS
  // ==============================
  const viewAsset = async (asset_id) => {
    try {
      const res = await axios.get(`${API}/asset/${asset_id}`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (e) {
      setResponse("View asset failed: " + e.message);
    }
  };

  const viewListing = async (listing_id) => {
    try {
      const res = await axios.get(`${API}/asset/listing/${listing_id}`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (e) {
      setResponse("View listing failed: " + e.message);
    }
  };

  const fetchTopAssets = async () => {
    try {
      const res = await axios.get(`${API}/analytics/assets`);
      const data = res.data;

      if (Array.isArray(data)) {
        setAssets(data);
      } else if (data && Array.isArray(data.assets)) {
        setAssets(data.assets); // handle possible { assets: [...] } wrapper
      } else {
        console.warn("Unexpected assets format:", data);
        setAssets([]);
      }
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setAssets([]);
      setResponse("Failed to load top assets: " + err.message);
    }
  };

  useEffect(() => {
    fetchTopAssets();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Real Estate Tokenization Dashboard</h1>

      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Wallet: {wallet || "Not connected"}</p>

      <hr />
      <button onClick={login}>Login (admin)</button>
      <hr />

      <h2>Admin Actions</h2>
      <button onClick={createAsset}>Create Asset</button>
      <button onClick={() => updateAsset(1)}>Update Asset #1</button>
      <button onClick={() => deleteAsset(1)}>Delete Asset #1</button>
      <hr />

      <h2>Customer Actions</h2>
      <button onClick={() => buyPrimary(1, 2, ethers.parseEther("0.01"))}>
        Buy 2 Shares (primary)
      </button>
      <button onClick={() => sellShares(1, 1, ethers.parseEther("0.02"))}>
        Sell 1 Share
      </button>
      <button onClick={() => buyListing(1, 1, ethers.parseEther("0.02"))}>
        Buy Listed Share
      </button>
      <hr />

      <h2>View Data</h2>
      <button onClick={() => viewAsset(1)}>View Asset #1</button> 
      <button onClick={() => viewListing(1)}>View Listing #1</button>

      <hr />
      <h2>Top Assets</h2>
      {assets.length > 0 ? (
        assets.map((a) => (
          <div key={a.id || Math.random()}>
            {a.id || "?"} – {a.name || "Unnamed"} – Shares Sold: {a.sharesSold?.toString() ?? "0"}
          </div>
        ))
      ) : (
        <div style={{ color: "#888" }}>
          No assets loaded yet {response.includes("Failed") ? "(check backend)" : ""}
        </div>
      )}

      <hr />
      <h2>Response / Logs</h2>
      <pre style={{ background: "#f8f8f8", padding: 12, borderRadius: 6 }}>
        {response || "No messages yet"}
      </pre>
    </div>
  );
}

export default App;