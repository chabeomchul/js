import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const fetchCodes = async () => {
  const { data } = await api.get("/codes"); // { years: [...], main: [...], sub: [...] }
  return data;
};

export const fetchStats = async (params) => {
  const { data } = await api.get("/stats", { params });
  return data; // [{ category: '', value: 100 }, ...]
};