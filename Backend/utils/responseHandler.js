/**
 * Utility functions for handling API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Object} meta - Additional metadata
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
  const response = {
    success: true,
    status: statusCode,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Detailed errors
 */
const errorResponse = (res, statusCode = 500, message = 'Error', errors = null) => {
  const response = {
    success: false,
    status: statusCode,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Object} pagination - Pagination details
 */
const paginatedResponse = (res, statusCode = 200, message = 'Success', data = [], pagination = {}) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      totalItems: pagination.totalItems || 0,
      totalPages: pagination.totalPages || 0,
      hasNextPage: pagination.hasNextPage || false,
      hasPrevPage: pagination.hasPrevPage || false
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};