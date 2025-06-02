const Skill = require('../models/SkillSection');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    if (skills.length === 0) {
      return res.status(404).json({
        status: 'false',
        message: 'No skills found',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Skills retrieved successfully',
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: 'Internal server error',
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
        message: 'Name and image are required',
      });
    }
    const newSkill = new Skill({ name, image });
    await newSkill.save();
    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: newSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
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
        message: 'Name and image are required',
      });
    }
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { name, image },
      { new: true },
    );
    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
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
        message: 'Skill not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: deletedSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
