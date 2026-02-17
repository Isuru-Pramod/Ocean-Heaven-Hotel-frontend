import { useState } from "react";
import { getContract } from "../services/contract";

function TransferShares() {
  const [assetId, setAssetId] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    const contract = await getContract();

    const tx = await contract.transferShares(assetId, to, amount);
    await tx.wait();

    alert("Shares Transferred!");
  };

  return (
    <div>
      <h2>Transfer Shares</h2>
      <input placeholder="Asset ID" onChange={e => setAssetId(e.target.value)} />
      <input placeholder="Recipient Address" onChange={e => setTo(e.target.value)} />
      <input placeholder="Amount" onChange={e => setAmount(e.target.value)} />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default TransferShares;
