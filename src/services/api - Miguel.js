import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.19.66:86/api', // URL del backend
    withCredentials: true, // Necesario si usas Laravel Sanctum
    headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
    }
});

export default api;
