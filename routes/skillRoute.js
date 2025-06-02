const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { authenticate } = require('../middleware/authentication');

// Route to get all skills
router.get('/', getAllSkills);

// Route to create a new skill
router.post('/create', authenticate, addSkill);

// Route to update a skill by ID
router.put('/update/:id', authenticate, updateSkill);

// Route to delete a skill by ID
router.delete('/delete/:id', authenticate, deleteSkill);

module.exports = router;
