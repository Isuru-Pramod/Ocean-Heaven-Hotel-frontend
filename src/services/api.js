const API = import.meta.env.VITE_BACKEND_URL;

export const getAsset = async (id) => {
  const res = await fetch(`${API}/asset/${id}`);
  return res.json();
};

export const getTopTen = async (id) => {
  const res = await fetch(`${API}/asset/${id}/top10`);
  return res.json();
};
