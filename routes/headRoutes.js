const express = require('express');
const {
  viewImage,
  addImage,
  editImage,
  deleteImage,
} = require('../controllers/headController');
const { authenticate } = require('../middleware/authentication');
const router = express.Router();

//View Image
router.get('/image', viewImage);

//Add Image
router.post('/add-image', authenticate, addImage);

//Update Image
router.put('/update-image', authenticate, editImage);

//Delete Image
router.delete('/delete-image', authenticate, deleteImage);

module.exports = router;
