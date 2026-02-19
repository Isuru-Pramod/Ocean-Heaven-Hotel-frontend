import { useState } from "react";
import { getContract } from "../services/contract";
import { ethers } from "ethers";

function CreateAsset() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  const handleCreate = async () => {
    const contract = await getContract();

    const tx = await contract.createAsset(
      name,
      location,
      shares,
      ethers.parseEther(price)
    );

    await tx.wait();
    alert("Asset Created!");
  };

  return (
    <div>
      <h2>Create Asset</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
      <input placeholder="Total Shares" onChange={e => setShares(e.target.value)} />
      <input placeholder="Share Price (ETH)" onChange={e => setPrice(e.target.value)} />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default CreateAsset;
