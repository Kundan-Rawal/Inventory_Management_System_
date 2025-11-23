// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';

export const fetchProducts = async (search = '') => {
    const url = search ? `${API_URL}?name=${search}` : API_URL;
    const response = await axios.get(url);
    return response.data;
};

export const importCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const getHistory = async (id) => {
    const response = await axios.get(`${API_URL}/${id}/history`);
    return response.data;
};

export const addProduct = async (data) => {
    
    const response = await axios.post(API_URL, data);
    return response.data;
};


export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};