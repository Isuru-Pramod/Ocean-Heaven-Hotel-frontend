import { useState } from "react";
import { getContract } from "../services/contract";
import { ethers } from "ethers";

function BuyShares() {
  const [assetId, setAssetId] = useState("");
  const [amount, setAmount] = useState("");

  const handleBuy = async () => {
    const contract = await getContract();

    const asset = await contract.assets(assetId);
    const price = asset[4];

    const tx = await contract.buyShares(assetId, amount, {
      value: price * BigInt(amount)
    });

    await tx.wait();
    alert("Shares Purchased!");
  };

  return (
    <div>
      <h2>Buy Shares</h2>
      <input placeholder="Asset ID" onChange={e => setAssetId(e.target.value)} />
      <input placeholder="Amount" onChange={e => setAmount(e.target.value)} />
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}

export default BuyShares;
