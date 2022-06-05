const mongoose = require('mongoose')

const SceneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const SceneModel = mongoose.model("scenes", SceneSchema);

module.exports = SceneModel; 