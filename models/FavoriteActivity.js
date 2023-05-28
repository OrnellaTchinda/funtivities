const mongoose = require("mongoose");

const FavoriteActivitySchema = new mongoose.Schema({
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
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
module.exports = mongoose.model("FavoriteActivity", FavoriteActivitySchema);
