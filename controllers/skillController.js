const Skill = require("../models/SkillSection");
const { client } = require("../config/redis");

const REDIS_KEY = "skills";
const CACHE_TTL = 3600;

exports.getAllSkills = async (req, res) => {
  try {
    let cacheSkills;

    try {
      cacheSkills = await client.get(REDIS_KEY);
    } catch (err) {
      console.warn("Redis read failed:", err.message);
    }

    if (cacheSkills) {
      
      return res.status(200).json({
        success: true,
        message: "Skills retrieved successfully",
        data: JSON.parse(cacheSkills),
      });
    }

    const skills = await Skill.find();

    if (skills.length === 0) {
      return res.status(404).json({
        status: "false",
        message: "No skills found",
      });
    }

    try {
      await client.setEx(REDIS_KEY, CACHE_TTL, JSON.stringify(skills));
    } catch (err) {
      console.warn("Redis write failed:", err.message);
    }

    
    res.status(200).json({
      status: "success",
      message: "Skills retrieved successfully",
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required",
      });
    }
    const newSkill = new Skill({ name, image: `${image}&raw=true` });
    await newSkill.save();

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: newSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required",
      });
    }
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
    );
    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      data: deletedSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
