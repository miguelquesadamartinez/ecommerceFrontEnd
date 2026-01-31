import axios from "axios";
import { API_CONFIG } from '../config/config';

export class ErrorHandler {
  static async sendErrorEmail(error, context = {}) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token stored");
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context: {
          ...context,
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      };
      await axios.post(`${API_CONFIG.API_URL}/error-notification`, 
        { errorDetails },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            //'Access-Control-Allow-Credentials': 'true',
            'Accept': 'application/json',
          }
        }
      );
    } catch (emailError) {
      console.error("Échec de l'envoi de l'e-mail d'erreur:", emailError);
    }
  }

  static async handleError(error, context = {}) {
    await this.sendErrorEmail(error, context);
    //throw error; // Re-throw para mantener el flujo normal de errores
  }
}
