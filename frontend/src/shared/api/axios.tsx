import axios from "axios";


const api = axios.create({  // create は自分用にカスタマイズしたaxiosを作るという意味。
  baseURL: "http://127.0.0.1:8000/api",
});


export default api;
