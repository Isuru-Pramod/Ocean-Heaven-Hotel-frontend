import { useEffect, useState } from "react";
import { getTopTen } from "../services/api";

function TopTen({ assetId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTopTen(assetId);
      setData(result);
    };
    fetchData();
  }, [assetId]);

  return (
    <div>
      <h2>Top 10 Investors</h2>
      <ul>
        {data.map((inv, index) => (
          <li key={index}>
            {inv.address} - {inv.shares} shares
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopTen;
