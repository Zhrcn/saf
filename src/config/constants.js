export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  DOCTOR: {
    PROFILE: '/doctors/profile',
    PATIENTS: '/doctors/patients',
    APPOINTMENTS: '/doctors/appointments',
    CONSULTATIONS: '/doctors/consultations',
  },
  PATIENT: {
    PROFILE: '/patients/profile',
    APPOINTMENTS: '/patients/appointments',
    PRESCRIPTIONS: '/patients/prescriptions',
    CONSULTATIONS: '/patients/consultations',
    MEDICAL_FILE: '/patients/medical-file',
  },
};

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
};

export const AUTH_CONSTANTS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
  API_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    CURRENT_USER: '/auth/me',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PASSWORD: '/auth/update-password',
  },
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, 
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, 
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is locked. Please try again later',
    TOKEN_EXPIRED: 'Session expired. Please log in again',
    INVALID_TOKEN: 'Invalid token',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    VALIDATION_ERROR: 'Please check your input',
  },
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    EMAIL_VERIFIED: 'Email verified successfully',
  },
};

export const DOCTOR_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
  },
  SPECIALIZATION: {
    GENERAL_PRACTITIONER: 'general_practitioner',
    CARDIOLOGIST: 'cardiologist',
    DERMATOLOGIST: 'dermatologist',
    NEUROLOGIST: 'neurologist',
    PEDIATRICIAN: 'pediatrician',
    PSYCHIATRIST: 'psychiatrist',
    OTHER: 'other',
  },
  APPOINTMENT_TYPES: {
    CONSULTATION: 'consultation',
    FOLLOW_UP: 'follow_up',
    EMERGENCY: 'emergency',
    ROUTINE: 'routine',
  },
  CONSULTATION_TYPES: {
    IN_PERSON: 'in_person',
    VIDEO: 'video',
    PHONE: 'phone',
  },
};

export const PATIENT_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
  BLOOD_TYPES: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
};

export const APPOINTMENT_CONSTANTS = {
  STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    RESCHEDULED: 'rescheduled',
  },
  DURATION: {
    SHORT: 15, 
    MEDIUM: 30,
    LONG: 60,
  },
};

export const PRESCRIPTION_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  FREQUENCY: {
    DAILY: 'daily',
    TWICE_DAILY: 'twice_daily',
    THREE_TIMES_DAILY: 'three_times_daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    AS_NEEDED: 'as_needed',
  },
};

export const CONSULTATION_CONSTANTS = {
  STATUS: {
    PENDING: 'pending',
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  TYPE: {
    INITIAL: 'initial',
    FOLLOW_UP: 'follow_up',
    EMERGENCY: 'emergency',
  },
};

export const NOTIFICATION_CONSTANTS = {
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
  },
}; 