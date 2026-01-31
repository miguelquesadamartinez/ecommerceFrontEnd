import axios from 'axios';
import { API_CONFIG } from '../config/config';

export const getPharmacy = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token stored");
    const response = await axios.post(`${API_CONFIG.API_URL}/get/pharmacy-id`,
      { pharmacy_id: id },
      { 
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Credentials': 'true',
          'Accept': 'application/json',
        }
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPharmacy = async (searchText) => {
  console.log('searchText');
  console.log(searchText);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token stored");
    const response = await axios.post(`${API_CONFIG.API_URL}/get/create-pharmacy`,
      { searchText },
      { 
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Credentials': 'true',
          'Accept': 'application/json',
        }
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePharmacy = async (id, pharmacyData, new_farm) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token stored");
    const response = await axios.post(`${API_CONFIG.API_URL}/pharmacy-update`,
      { 
        id: id,
        pharmacyData: pharmacyData,
        new_farm: new_farm
      },
      { 
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Credentials': 'true',
          'Accept': 'application/json',
        }
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
