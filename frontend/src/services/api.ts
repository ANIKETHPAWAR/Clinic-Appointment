import { config } from '../config/environment';

const API_BASE_URL = config.API_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Handle different response formats from backend
      if (responseData.data) {
        return { data: responseData.data };
      } else if (responseData.queue) {
        return { data: responseData.queue };
      } else if (responseData.patients) {
        return { data: responseData.patients };
      } else if (responseData.doctors) {
        return { data: responseData.doctors };
      } else if (responseData.appointments) {
        return { data: responseData.appointments };
      } else if (responseData.stats) {
        return { data: responseData.stats };
      } else if (responseData.token) {
        return { data: responseData };
      } else if (responseData.message && responseData.doctor) {
        return { data: responseData.doctor };
      } else if (responseData.message && responseData.patient) {
        return { data: responseData.patient };
      } else if (responseData.message && responseData.appointment) {
        return { data: responseData.appointment };
      } else {
        return { data: responseData };
      }
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication
  async login(credentials: { username: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { username: string; password: string; email: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Queue Management
  async getQueue() {
    return this.request<any[]>('/queue');
  }

  async addToQueue(patientData: { name: string; priority: string; reason?: string; notes?: string }) {
    return this.request<any>('/queue', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updateQueueStatus(id: number, status: string) {
    return this.request<any>(`/queue/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async removeFromQueue(id: number) {
    return this.request<any>(`/queue/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments
  async getAppointments() {
    return this.request<any[]>('/appointments');
  }

  async createAppointment(appointmentData: {
    patientName: string;
    doctorId: number;
    date: string;
    time: string;
    notes?: string;
  }) {
    return this.request<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id: number, appointmentData: any) {
    return this.request<any>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id: number) {
    return this.request<any>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors
  async getDoctors() {
    return this.request<any[]>('/doctors');
  }

  async createDoctor(doctorData: {
    firstName: string;
    lastName: string;
    specialization: string;
    gender: string;
    location: string;
    isActive: boolean;
    email: string;
    phone: string;
  }) {
    return this.request<any>('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  async updateDoctor(id: number, doctorData: any) {
    return this.request<any>(`/doctors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(id: number) {
    return this.request<any>(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Patients
  async getPatients() {
    return this.request<any[]>('/patients');
  }

  async createPatient(patientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    address?: string;
  }) {
    return this.request<any>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async togglePatientStatus(id: number) {
    return this.request<any>(`/patients/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }

  async deletePatient(id: number) {
    return this.request<any>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request<{
      totalPatients: number;
      totalDoctors: number;
      totalAppointments: number;
      queueLength: number;
    }>('/dashboard/stats');
  }
}

export const apiService = new ApiService(); 