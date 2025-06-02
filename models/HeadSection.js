const mongoose = require('mongoose');
const { Schema } = mongoose;

const HeadSchema = new Schema({
    image: {
        type: String,
        require: true
    }
});

const Head = mongoose.model('Head', HeadSchema);
module.exports = Head;
