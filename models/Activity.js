const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
        required: true,
    },
    material: {
        type: [String],
        required: true,
    },
    directions: {
        type: [String],
        required: true,
    },

    image: {
        type: String,
        require: true,
    },
    cloudinaryId: {
        type: String,
        require: true,
    },
    caption: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        required: true,
    },
    favorites: {
        type: Array,
        required: true,
    },
    user: { //reference to our user model
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//MongoDB Collection named here - will give lowercase plural of name //for exple this down here will give posts in the DB
module.exports = mongoose.model("Activity", ActivitySchema);
