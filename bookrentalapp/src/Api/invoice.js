import axios from 'axios';
import config from "../config";

const API_URL = config.apiUrl;

// Create a purchase invoice
export const createPurchaseInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoice/purchase`, invoiceData);
    return response;
  } catch (error) {
    console.error('Error creating purchase invoice:', error);
    throw error;
  }
};

// Create a return invoice
export const createReturnInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoice/return`, invoiceData);
    return response;
  } catch (error) {
    console.error('Error creating return invoice:', error);
    throw error;
  }
};

// Get all invoices for a user
export const getUserInvoices = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/invoice/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    throw error;
  }
};

// Get a specific invoice by ID
export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await axios.get(`${API_URL}/invoice/${invoiceId}`);
    return response;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};