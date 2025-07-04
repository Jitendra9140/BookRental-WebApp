// Configuration for different environments

const config = {
  development: {
    apiUrl: 'http://localhost:8000',
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL
  }
};

// Determine current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration for current environment
export default config[env];