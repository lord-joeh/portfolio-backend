const mongoose = require('mongoose');
const { Schema } = mongoose;

const AboutSchema = new Schema({
  aboutText: {
    type: String,
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
});

const About = mongoose.model('About', AboutSchema);
module.exports = About;
