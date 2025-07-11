import { api } from '../api';

export const medicationApi = {
  getMedications: () => api.get('/medications'),
  getActiveMedications: () => api.get('/medications/active'),
  addMedication: (medicationData) => api.post('/medications', medicationData),
  updateMedication: (id, medicationData) => api.put(`/medications/${id}`, medicationData),
  deleteMedication: (id) => api.delete(`/medications/${id}`),
}; 