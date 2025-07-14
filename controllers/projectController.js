const Project = require("../models/ProjectSection");
const { client } = require("../config/redis");

const REDIS_KEY = "projects";
const CACHE_TTL = 3600;

exports.getAllProjects = async (req, res) => {
  try {
    let cacheProjects;

    try {
      cacheProjects = await client.get(REDIS_KEY);
    } catch (err) {
      console.warn("Redis read failed:", err.message);
    }

    if (cacheProjects) {
      
      return res.status(200).json({
        success: true,
        message: "Projects retrieved successfully",
        data: JSON.parse(cacheProjects),
      });
    }

    const projects = await Project.find();

    if (!projects) {
      return res.status(404).json({
        success: false,
        message: "No projects found",
      });
    }

    try {
      await client.setEx(REDIS_KEY, CACHE_TTL, JSON.stringify(projects));
    } catch (err) {
      console.warn("Redis write failed:", err.message);
    }

    
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addProject = async (req, res) => {
  try {
    const { title, description, imageUrl, link } = req.body;
    if (!title || !description || !imageUrl || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const newProject = new Project({
      title,
      description,
      imageUrl: `${imageUrl}&raw=true`,
      link,
    });

    await newProject.save();

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }
    res.status(201).json({
      success: true,
      message: "Project added successfully",
      data: newProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, link } = req.body;
    if (!title || !description || !imageUrl || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageUrl,
        link,
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    res.status(200).json({
      success: false,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
