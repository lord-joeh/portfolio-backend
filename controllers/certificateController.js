const Certificate = require('../models/Certification');

exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    if (!certificates) {
      return res.status(404).json({
        success: false,
        message: 'No certificates found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Certificates retrieved successfully',
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.addCertificate = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    const newCertificate = new Certificate({
      title,
      description,
      imageUrl,
    });
    await newCertificate.save();
    res.status(201).json({
      success: true,
      message: 'Certificate added successfully',
      data: newCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      { title, description, imageUrl },
      { new: true },
    );
    if (!updatedCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updatedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCertificate = await Certificate.findByIdAndDelete(id);
    if (!deletedCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
      data: deletedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
