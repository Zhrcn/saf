export const handleAuthError = (error) => {
    console.error('Auth error:', error);

    if (error?.data?.message) {
        return error.data.message;
    }

    if (error?.error) {
        return error.error;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
};

export const handleApiError = (error) => {
  const message = error.data?.message || error.message || 'API error';
  const status = error.status || 500;
  const errorType = error.name || 'UnknownError';
  
  return {
    message,
    status,
    type: errorType,
    originalError: error
  };
};

export const isAuthError = (error) => {
  return error.status === 401 || error.status === 403;
};

export const isNetworkError = (error) => {
  return error.name === 'NetworkError' || !error.status;
};

export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }
  if (isAuthError(error)) {
    return 'Authentication error. Please log in again.';
  }
  return error.message || 'An unexpected error occurred.';
}; 