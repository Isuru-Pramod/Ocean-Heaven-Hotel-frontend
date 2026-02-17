import CreateAsset from "./components/CreateAsset";
import BuyShares from "./components/BuyShares";
import TransferShares from "./components/TransferShares";
import AssetDashboard from "./components/AssetDashboard";

function App() {
  return (
    <div>
      <h1>Ocean Heaven Tokenized Real Estate</h1>
      <CreateAsset />
      <BuyShares />
      <TransferShares />
      <AssetDashboard />
    </div>
  );
}

export default App;
