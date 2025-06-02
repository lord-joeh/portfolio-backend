const mongoose = require('mongoose');
const { Schema } = mongoose;

const SkillSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    }
});

const skill = mongoose.model('skill', SkillSchema);
module.exports = skill;