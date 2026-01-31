import axios from 'axios';
import { API_CONFIG } from '../config/config';

/**
 * Get all products
 * @returns {Promise} Promise with products data
 */
export const getProducts = async () => {
  return await axios.get(`${API_CONFIG.API_URL}/products`);
};

/**
 * Get a product by ID
 * @param {number} id - Product ID
 * @returns {Promise} Promise with product data
 */
export const getProduct = async (id) => {
  return await axios.get(`${API_CONFIG.API_URL}/products/${id}`);
};

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise} Promise with created product data
 */
export const createProduct = async (productData) => {
  return await axios.post(`${API_CONFIG.API_URL}/products`, productData);
};

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} Promise with updated product data
 */
export const updateProduct = async (id, productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token stored");
    const response = await axios.post(`${API_CONFIG.API_URL}/product-update`,
      { id, productData },
      { headers: {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Credentials': 'true',
        'Accept': 'application/json',
        }
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

/**
 * Delete a product
 * @param {number} id - Product ID
 * @returns {Promise} Promise with deletion result
 */
export const deleteProduct = async (id) => {
  return await axios.delete(`${API_CONFIG.API_URL}/products/${id}`);
};

/**
 * Search products by name, CIP13, or SAP ID
 * @param {string} query - Search query
 * @returns {Promise} Promise with search results
 */
export const searchProducts = async (query) => {
  return await axios.get(`${API_CONFIG.API_URL}/products/search?q=${query}`);
};

/**
 * Get product categories
 * @returns {Promise} Promise with categories data
 */
export const getProductCategories = async () => {
  return await axios.get(`${API_CONFIG.API_URL}/product-categories`);
};
