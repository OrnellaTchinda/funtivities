const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const activitiesController = require("../controllers/activities");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
//Since linked from server js treat each path as :
// post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, activitiesController.getActivity);

//Tells multer to process this request, and accept a single file from the input with a `name="file"`
//Enables user to create post w/ cloudinary for media uploads
router.post("/createActivity", upload.single("file"), activitiesController.createActivity);


router.put("/favoriteActivity/:id", activitiesController.favoriteActivity);


// Enables user to like post , In controller, uses Post model to update like by 1
router.put("/likeActivity/:id", activitiesController.likeActivity);

//Enables user to delete post, In controller uses POST model to delete post from MongoDB collection
router.delete("/deleteActivity/:id", activitiesController.deleteActivity);

module.exports = router;
