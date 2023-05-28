const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.get("/feed", ensureAuth, postsController.getFeed);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.post("/favoriteRecipe/:id", postsController.favoriteRecipe);

router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
