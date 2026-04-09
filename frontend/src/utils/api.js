// API utility for making authenticated requests

const API_BASE_URL = 'http://localhost:8081/api';

// Get auth headers with JWT token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get auth headers for file uploads (no Content-Type)
export const getAuthHeadersForFiles = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic fetch wrapper with authentication
export const authFetch = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const defaultOptions = {
    headers: isFormData ? getAuthHeadersForFiles() : getAuthHeaders(),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/';
    throw new Error('Session expired. Please login again.');
  }

  // Handle 403 Forbidden - insufficient permissions
  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }

  return response;
};

// Convenience methods
export const api = {
  get: (url) => authFetch(url, { method: 'GET' }),
  
  post: (url, data) => authFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (url, data) => authFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (url) => authFetch(url, { method: 'DELETE' }),
  
  // For file uploads
  postFile: (url, formData) => authFetch(url, {
    method: 'POST',
    body: formData,
  }),
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user info
export const getCurrentUser = () => {
  return {
    username: localStorage.getItem('user'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
  };
};

// Logout user
export const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};
