const Head = require("../models/HeadSection");
const { client } = require("../config/redis");

const REDIS_KEY = "head";
const CACHE_TTL = 3600;

exports.addImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Validate image input
    if (!image || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Create and save new image
    const imageUrl = new Head({ image: `${image}&raw=true` });
    const savedImage = await imageUrl.save();

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Image added successfully!",
      data: savedImage,
    });
  } catch (error) {
    console.error("Error adding image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.viewImage = async (req, res) => {
  try {
    let cacheHead;

    try {
      cacheHead = await client.get(REDIS_KEY);
    } catch (err) {
      console.warn("Redis read failed:", err.message);
    }

    if (cacheHead) {
      
      return res.status(200).json({
        success: true,
        data: JSON.parse(cacheHead),
      });
    }

    const image = await Head.findOne().select("-__v");

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "No image found",
      });
    }

    try {
      await client.setEx(REDIS_KEY, CACHE_TTL, JSON.stringify(image));
    } catch (err) {
      console.warn("Redis write failed:", err.message);
    }

    

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error viewing image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.editImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Validate image input
    if (!image || image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Find and update image
    const updatedImage = await Head.findOneAndUpdate(
      {},
      { image },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: "No image found to update",
      });
    }

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }
    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const deletedImage = await Head.findOneAndDelete();

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "No image found to delete",
      });
    }

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
