const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const activitiesController = require("../controllers/activities");
const { ensureAuth } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/feedA", ensureAuth, activitiesController.getFeed);

router.get("/profileA", ensureAuth, activitiesController.getProfile);

router.get("/favoriteActivity", ensureAuth, activitiesController.getFavoriteActivities);
router.get("/favoriteRecipe", ensureAuth, postsController.getFavoriteRecipes);


router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
