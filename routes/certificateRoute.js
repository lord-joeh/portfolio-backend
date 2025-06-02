const express = require('express');
const router = express.Router();
const {
  getAllCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { authenticate } = require('../middleware/authentication');

// Get all certificates
router.get('/', getAllCertificates);

// Add a new certificate
router.post('/', authenticate, addCertificate);

// Update a certificate by ID
router.put('/:id', authenticate, updateCertificate);

// Delete a certificate by ID
router.delete('/:id', authenticate, deleteCertificate);

module.exports = router;
