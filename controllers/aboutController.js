const { client } = require("../config/redis");
const About = require("../models/AboutSection");

const REDIS_KEY = "aboutInfo";
const CACHE_TTL = 604800;

exports.aboutInfo = async (req, res) => {
  try {
    let cacheInfo;
    try {
      cacheInfo = await client.get(REDIS_KEY);
    } catch (err) {
      console.warn("Redis read failed:", err.message);
    }

    if (cacheInfo) {
      
      return res.status(200).json({ success: true, data: JSON.parse(cacheInfo) });
    }

    const info = await About.findOne().select("-__v");

    if (!info) {
      return res.status(404).json({ success: false, message: "No about information found" });
    }

    try {
      await client.setEx(REDIS_KEY, CACHE_TTL, JSON.stringify(info));
    } catch (err) {
      console.warn("Redis write failed:", err.message);
    }

    
    return res.status(200).json({ success: true, data: info });
  } catch (error) {
    console.error("Error fetching about info:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addAboutContent = async (req, res) => {
  try {
    const { aboutText, resumeUrl } = req.body;

    if (typeof aboutText !== "string" || !aboutText.trim() || typeof resumeUrl !== "string" || !resumeUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide both aboutText and resumeUrl",
      });
    }

    try {
      new URL(resumeUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL for the resume",
      });
    }

    let about = await About.findOne();
    if (!about) {
      about = new About({ aboutText, resumeUrl });
    } else {
      about.aboutText = aboutText.trim();
      about.resumeUrl = resumeUrl.trim();
    }

    await about.save();

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "About content added successfully",
      data: about,
    });
  } catch (error) {
    console.error("Error adding about content:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.editAbout = async (req, res) => {
  try {
    const { aboutText, resumeUrl } = req.body;

    if (!aboutText && !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About section not found",
      });
    }

    if (resumeUrl) {
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" +
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
          "((\\d{1,3}\\.){3}\\d{1,3}))" +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
          "(\\?[;&a-z\\d%_.~+=-]*)?" +
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );

      if (!urlPattern.test(resumeUrl)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid URL for the resume",
        });
      }

      about.resumeUrl = resumeUrl.trim();
    }

    if (aboutText) {
      about.aboutText = aboutText.trim();
    }

    const updatedAbout = await about.save();

    try {
      await client.del(REDIS_KEY);
    } catch (err) {
      console.warn("Failed to delete Redis key:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "About section updated successfully",
      data: updatedAbout,
    });
  } catch (error) {
    console.error("Error updating about section:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
