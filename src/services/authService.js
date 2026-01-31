import axios from "axios";
import { ErrorHandler } from '../services/errorHandlingService';
import { API_CONFIG } from '../config/config';

export const isTokenExpired = async () => {
  try {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!token || !tokenExpiry) {
      return true;
    }

    const validToken = await checkToken();
    if ( ! validToken ) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      return true;
    }

    const now = new Date();
    const expiryDate = new Date(tokenExpiry);
    if (now >= expiryDate) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      return true;
    }
    return false;
  } catch (error) {
    // ErrorHandler.handleError(error, {
    //       component: 'authService',
    //       action: 'isTokenExpired'
    //     });
    // console.error('Error al comprobar el token:', error.message);
    throw error;
  }
};

export const checkToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await axios.post(`${API_CONFIG.URL}/sanctum/verify-token`,
      { token },
      { headers: { 'Accept': 'application/json' }}
    );

    if (response.status === 200) {
      localStorage.setItem("user_name", response.data.user.name);
      localStorage.setItem("user_type", response.data.user.user_type);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const calculateExpiryDate = (minutes) => {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + minutes * 60000);
  return expiryDate;
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_CONFIG.URL}/sanctum/get-token`, { email, password });

    const token = response.data.token;
    const expiryDate = calculateExpiryDate(480);
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiryDate.toISOString());
    localStorage.setItem("user_type", response.data.user_type);
    return token;
  } catch (error) {
    // ErrorHandler.handleError(error, {
    //   component: 'authService',
    //   action: 'login'
    // });
    // console.error("Erreur de connexion", error.message);
    throw error;
  }
};
