import axios from 'axios';

const api = axios.create({
   // baseURL: 'http://172.18.41.87:86/api', // URL del backend
    baseURL: import.meta.env.VITE_API_URL, // ✅ local via proxy
    withCredentials: true, // Necesario si usas Laravel Sanctum
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // ✅ Identifie les requêtes AJAX
        'Content-Type': 'application/json',   // ✅ Optionnel mais recommandé
       // 'Access-Control-Allow-Credentials': 'true',
    }
});

export default api;
