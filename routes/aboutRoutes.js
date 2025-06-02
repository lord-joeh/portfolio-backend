const express = require('express');
const router = express.Router();
const {
  aboutInfo,
  addAboutContent,
  editAbout,
} = require('../controllers/aboutController');
const { authenticate } = require('../middleware/authentication');

//Get about Info
router.get('/info', aboutInfo);

//Add about content
router.post('/add-content', authenticate, addAboutContent);

//Edit about content
router.put('/edit-content', authenticate, editAbout);

module.exports = router;
