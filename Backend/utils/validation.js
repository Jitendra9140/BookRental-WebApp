/**
 * Utility functions for validation
 */
const mongoose = require('mongoose');

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
  if (!id || id === 'null' || id === 'undefined' || typeof id !== 'string') {
    return false;
  }
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validates if an array contains only valid MongoDB ObjectIds
 * @param {Array<string>} ids - Array of IDs to validate
 * @returns {boolean} - True if all IDs are valid, false otherwise
 */
const areValidObjectIds = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return false;
  }
  return ids.every(id => isValidObjectId(id));
};

module.exports = {
  isValidObjectId,
  areValidObjectIds
};