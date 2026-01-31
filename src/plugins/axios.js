import axios from "axios";

axios.defaults.baseURL = "/api"; // Backend Laravel
axios.defaults.withCredentials = true; // Importante para las cookies

export default axios;
