import axios from "axios";
import { ErrorHandler } from '../services/errorHandlingService';
import { API_CONFIG } from '../config/config';

export const sendOrderProduct = async (order_id, pharmacy_id, product_id, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");
    const response = await axios.post(`${API_CONFIG.API_URL}/order/item-add`, 
      { order_id, pharmacy_id, product_id, quantity },
      { headers: { 
                 Authorization: `Bearer ${token}`,
                 'Access-Control-Allow-Credentials': 'true',
                 'Accept': 'application/json',
               },
    });
    return response;
  } catch (error) {
    //ErrorHandler.handleError(error, {
    //  component: 'OrderService',
    //  action: 'sendOrderProduct'
    //});
    //console.error("Error enviando el producto del pedido", error.message);
    throw error;
  }
};

export const deleteOrderProduct = async (order_id, product_id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");
    const response = await axios.post(`${API_CONFIG.API_URL}/order/item-remove`, 
      { order_id, product_id },
      { headers: { 
                 Authorization: `Bearer ${token}`,
                 'Access-Control-Allow-Credentials': 'true',
                 'Accept': 'application/json',
               },
    });
    return response;
  } catch (error) {
    //ErrorHandler.handleError(error, {
    //  component: 'OrderService',
    //  action: 'deleteOrderProduct'
    //});
    //console.error("Error borrando el producto del pedido", error.message);
    throw error;
  }
};

export const getOrder = async (order_id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");
    const response = await axios.post(`${API_CONFIG.API_URL}/order/get-order`, 
      { order_id },
      { headers: { 
                 Authorization: `Bearer ${token}`,
                 'Access-Control-Allow-Credentials': 'true',
                 'Accept': 'application/json',
               },
    });
    return response;
  } catch (error) {
    // ErrorHandler.handleError(error, {
    //   component: 'OrderService',
    //   action: 'getOrder'
    // });
    // console.error("Error obteniendo los productos", error.message);
    throw error;
  }
};

export const saveOrder = async (order_id, pharmacyData, order_urgent, modified_farm) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");
    const response = await axios.post(`${API_CONFIG.API_URL}/order/save-order`, 
      { order_id, pharmacyData, order_urgent, modified_farm },
      { headers: { 
                 Authorization: `Bearer ${token}`,
                 'Access-Control-Allow-Credentials': 'true',
                 'Accept': 'application/json',
               },
    });
    return response;
  } catch (error) {
    // ErrorHandler.handleError(error, {
    //   component: 'OrderService',
    //   action: 'saveOrder'
    // });
    // console.error("Error salvando el pedido", error.message);
    throw error;
  }
};
