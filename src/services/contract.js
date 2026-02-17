import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const abi = [
  "function createAsset(string,string,uint256,uint256)",
  "function buyShares(uint256,uint256) payable",
  "function transferShares(uint256,address,uint256)",
  "function assets(uint256) view returns (uint256,string,string,uint256,uint256,uint256,address,bool)",
  "function ownership(uint256,address) view returns (uint256)"
];

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
};
