import { useEffect, useState } from "react";
import { getAsset } from "../services/api.js";
import TopTen from "./TopTen";

function AssetDashboard() {
  const [assetId, setAssetId] = useState("1");
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const data = await getAsset(assetId);
      setAsset(data);
    };
    fetchAsset();
  }, [assetId]);

  return (
    <div>
      <h2>Asset Dashboard</h2>
      <input value={assetId} onChange={e => setAssetId(e.target.value)} />

      {asset && (
        <div>
          <p>Name: {asset.name}</p>
          <p>Location: {asset.location}</p>
          <p>Total Shares: {asset.totalShares}</p>
          <p>Shares Sold: {asset.sharesSold}</p>
        </div>
      )}

      <TopTen assetId={assetId} />
    </div>
  );
}

export default AssetDashboard;
