import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const api = {
  async getColleges() {
    try {
      const response = await axios.get(`${API_BASE_URL}/colleges`);
      return response.data;
    } catch (error) {
      console.error('Error fetching colleges:', error);
      return [];
    }
  },

  async getCareers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/careers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching careers:', error);
      return [];
    }
  },

  async getScholarships() {
    try {
      const response = await axios.get(`${API_BASE_URL}/scholarships`);
      return response.data;
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      return [];
    }
  }
};
