const mongoose = require("mongoose");

const FavoriteRecipeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
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
module.exports = mongoose.model("FavoriteRecipe", FavoriteRecipeSchema);
