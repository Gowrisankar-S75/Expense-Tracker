import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-1-p9wb.onrender.com/api"
});

export default api;