const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { authenticate } = require('../middleware/authentication');

// Get all projects
router.get('/', getAllProjects);

// Add a new project
router.post('/', authenticate, addProject);

// Update a project by ID
router.put('/:id', authenticate, updateProject);

// Delete a project by ID
router.delete('/:id', authenticate, deleteProject);

module.exports = router;
