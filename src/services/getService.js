import axios from "axios";
import { ErrorHandler } from '../services/errorHandlingService';
import { API_CONFIG } from '../config/config';

export const getOrders = async (page = 1, per_page = 10) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token stored");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/orders`,
            { page, per_page },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                }
            });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOrdersPharmacy = async (page = 1, per_page = 10, pharmacy_id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token stored");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/orders-farm`,
            { page, per_page, pharmacy_id },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                }
            });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getProducts = async (page = 1, per_page = 10, searchText = '') => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token stored");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/products`,
            { page, per_page, searchText },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                }
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getProducts'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const getPharmacies = async (page = 1, per_page = 10, searchText) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token stored");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/pharmacies`,
            { page, per_page, searchText },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                }
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getPharmacies'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const searchPharmacies = async (searchText) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token stocké");
        const response = await axios.post(`${API_CONFIG.API_URL}/search/pharmacy-search`,
            { searchText },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                },
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getOrders'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const getPharmacy = async (pharmacy_cip13) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token almacenado");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/pharmacy`,
            { pharmacy_cip13 },
            { headers: {
                    Authorization: `Bearer ${token}`,
                 //   'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                },
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getPharmacy'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const getPharmacyId = async (pharmacy_id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token almacenado");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/pharmacy-id`,
            { pharmacy_id },
            { headers: {
                    Authorization: `Bearer ${token}`,
                //    'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                },
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getPharmacyId'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const createPharmacy = async (searchText = '') => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token stocké");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/create-pharmacy`,
            { searchText },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                },
            });
        return response;
    } catch (error) {
        throw error;
    }
};

export const searchProducts = async (searchText) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token stocké");
        const response = await axios.post(`${API_CONFIG.API_URL}/search/product-search`,
            { searchText },
            { headers: {
                    Authorization: `Bearer ${token}`,

                    'Accept': 'application/json',
                }
                //,withCredentials: true, 
            });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllProductSrv = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token almacenado");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/all-products`,
            {  },
            { headers: {
                    Authorization: `Bearer ${token}`,
                   // 'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                }
                //,
                //withCredentials: true, // ✅ Indispensable pour Sanctum
            });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getProduct = async (product_cip13) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token almacenado");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/product`,
            { product_cip13 },
            { headers: {
                    Authorization: `Bearer ${token}`,
                   // 'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                },
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getProduct'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const getProductId = async (product_id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token almacenado");
        const response = await axios.post(`${API_CONFIG.API_URL}/get/product-id`,
            { product_id },
            { headers: {
                    Authorization: `Bearer ${token}`,
                  //  'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json',
                },
            });
        return response;
    } catch (error) {
        //ErrorHandler.handleError(error, {
        //  component: 'getService',
        //  action: 'getProductId'
        //});
        //console.error("Erreur lors de la récupération des commandes:", error.message);
        throw error;
    }
};

export const getCategories = async (product_id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token almacenado");

        const response = await axios.post(`${API_CONFIG.API_URL}/get/categories`,
            { product_id },
            { 
            headers: { 
                Authorization: `Bearer ${token}`,
                //'Access-Control-Allow-Credentials': 'true',
                'Accept': 'application/json',
                }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};
