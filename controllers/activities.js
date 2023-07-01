const cloudinary = require("../middleware/cloudinary");
const Activity = require("../models/Activity");
const Comment = require("../models/Comment");
const FavoriteActivities = require("../models/FavoriteActivity");
const User = require("../models/User")

module.exports = {
    getProfile: async (req, res) => {
        try {
            const activities = await Activity.find({ user: req.user.id });
            res.render("add-activities.ejs", { activities: activities, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },

    getFavoriteActivities: async (req, res) => {
        try {
            //Since we have a session, each request (req) contains the logged-in users info
            //console.log(req.user) to see everything
            //grabbing just the posts of the logged-in user
            const activities = await Activity.find({ user: req.user.id }); //we have a session and user tied to session
            //sending post data from mongoDB and user data to ejs template. The second posts is tied to the const variable posts up here
            console.log(activities)
            //What we need is a key in the recipes object that's why recipes.recipe
            res.render("favorite-activities.ejs", { activities: activities, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },

    getFeed: async (req, res) => {

        try {
            const activities = await Activity.find().sort({ createdAt: "desc" }).lean();
            var users = []
            for (i in activities) {
                var user = await User.findById(activities[i].user)
                users.push(user.userName)

            }
            res.render("activity-feed.ejs", { activities: activities, userName: users, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    getActivity: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id);
            const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
            res.render("activity.ejs", { activity: activity, user: req.user, comments: comments });

        } catch (err) {
            console.log(err);
        }
    },
    createActivity: async (req, res) => {
        try {
            // Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            await Activity.create({
                name: req.body.name,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                material: req.body.material.trim().split('\n'),
                directions: req.body.directions.trim().split('\n'),
                caption: req.body.caption,
                skills: req.body.skills,
                likes: 0,
                user: req.user.id,
            });
            console.log("Activity has been added!");
            res.redirect("/feedA");
        } catch (err) {
            console.log(err);
        }
    },

    favoriteActivity: async (req, res) => {
        let madeFavorite = false;
        try {
            var activity = await Activity.findById({ _id: req.params.id })
            madeFavorite = (activity.favorites.includes(req.user.id))

            //favorites array comes from activity model
        } catch (err) {

        }
        //if already made favorite we will remove the user from the favorites array
        if (madeFavorite) {
            try {
                await Activity.findOneAndUpdate({ _id: req.params.id },
                    {
                        $pull: { 'favorites': req.user.id }
                    })

                console.log('Removed user from favorites array')
                // res.redirect(`/activity/${req.params.id}`)
                res.redirect('back')
            } catch (err) {
                console.log(err)
            }
        } else {
            try {

                await Activity.findOneAndUpdate({ _id: req.params.id },
                    {
                        $addToSet: { 'favorites': req.user.id }
                    })

                console.log('Added user to favorites array')
                res.redirect('back')
                // res.redirect(`/activity/${req.params.id}`)

            } catch (err) {
                //media is stored on cloudinary the above request respond with url to media and the media id that you will need when deleting content

                // activity: req.params.id, //grab the id inside of our controller we grab in the logged in user and the  
                console.log(err)
            }
        }
    },

    likeActivity: async (req, res) => {
        var liked = false
        try {
            var activity = await Activity.findById({ _id: req.params.id })
            liked = (activity.likes.includes(req.user.id))
        } catch (err) {
            console.log(err)
        }
        //if already liked we will remove user from likes array
        if (liked) {
            try {
                await Activity.findOneAndUpdate({ _id: req.params.id },
                    {
                        $pull: { 'likes': req.user.id }
                    })

                console.log('Removed user from likes array')
                res.redirect(`/activity/${req.params.id}`)
            } catch (err) {
                console.log(err)
            }
        }
        //else add user to like array
        else {
            try {
                await Activity.findOneAndUpdate({ _id: req.params.id },
                    {
                        $addToSet: { 'likes': req.user.id }
                    })

                console.log('Added user to likes array')
                res.redirect(`/activity/${req.params.id}`)
            } catch (err) {
                console.log(err)
            }
        }
    },
    deleteActivity: async (req, res) => {
        try {
            // Find post by id
            let activity = await Activity.findById({ _id: req.params.id });
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(activity.cloudinaryId);
            // Delete post from db
            await Activity.remove({ _id: req.params.id });
            console.log("Deleted Activity");
            res.redirect("/profileA");
        } catch (err) {
            res.redirect("/profileA");
        }
    },
};
