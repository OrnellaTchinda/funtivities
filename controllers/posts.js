const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const FavoriteRecipes = require("../models/FavoriteRecipe");
const User = require("../models/User")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      var users = []
      for (i in posts) {
        var user = await User.findById(posts[i].user)
        users.push(user.userName)

      }
      res.render('feed.ejs', { posts: posts, userName: users, user: req.user })
    } catch (err) {
      console.log(err);
    }



  },

  getFavoriteRecipes: async (req, res) => {
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const posts = await FavoriteRecipes.find({ user: req.user.id }).populate('post');

      console.log(posts)

      //Sending post data from mongodb and user data to ejs template
      res.render("favorite-recipes.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        ingredients: req.body.ingredients.trim().split('\n'),
        directions: req.body.directions.trim().split('\n'),
        // trim the white space before the string and split into a newline
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteRecipe: async (req, res) => {
    try {
      //media is stored on cloudinary the above request respond with url to media and the media id that you will need when deleting content
      await FavoriteRecipes.create({
        user: req.user.id,
        recipe: req.params.id, //grab the id inside of our controller we grab in the logged in user and the recipe

      });
      console.log("FavoriteRecipe has been added!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
