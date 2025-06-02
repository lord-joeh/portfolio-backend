 const About = require('../models/AboutSection');

// Get about section information
exports.aboutInfo = async (req, res) => {
  try {
    const info = await About.findOne().select('-__v');
    if (!info) {
      return res
        .status(404)
        .json({ success: false, message: 'No about information found' });
    }
    return res.status(200).json({ success: true, data: info });
  } catch (error) {
    console.error('Error fetching about info:', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Add or update about section content
exports.addAboutContent = async (req, res) => {
  try {
    const { aboutText, resumeUrl } = req.body;

    // Validate input
    if (!aboutText?.trim() || !resumeUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both aboutText and resumeUrl',
      });
    }

    // Check if URL is valid
    try {
      new URL(resumeUrl);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL for the resume',
      });
    }

    // Find existing or create new
    let about = await About.findOne();
    if (!about) {
      about = new About({ aboutText, resumeUrl });
    } else {
      about.aboutText = aboutText;
      about.resumeUrl = resumeUrl;
    }

    await about.save();

    return res.status(201).json({
      success: true,
      message: 'About content added successfully',
      data: about,
    });
  } catch (error) {
    console.error('Error adding about content:', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Edit existing about section
exports.editAbout = async (req, res) => {
  try {
    const { aboutText, resumeUrl } = req.body;

    // Check if at least one field is provided
    if (!aboutText && !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update',
      });
    }

    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found',
      });
    }

    // Validate URL if provided using regex pattern for better URL validation
    if (resumeUrl) {
      const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
      );

      if (!urlPattern.test(resumeUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL for the resume',
        });
      }
      about.resumeUrl = resumeUrl;
    }

    if (aboutText) {
      about.aboutText = aboutText.trim();
    }

    const updatedAbout = await about.save();

    return res.status(200).json({
      success: true,
      message: 'About section updated successfully',
      data: updatedAbout,
    });
  } catch (error) {
    console.error('Error updating about section:', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
