const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const User = require('../models/User');

// get any user profile by his username
router.get('/:username', auth.authorizeOptional, async (req, res, next) => {
  try {
    const username = req.params.username;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(200).json({ msg: 'profile not found' });
    }
    return res.status(201).json({
      profile: {
        username: user.username,
        bio: user.bio,
        following: user.following,
      },
    });
  } catch (error) {
    return next(error);
  }
});


router.use(auth.verifyToken);


//follow  the user
router.get('/:username/follow', async (req, res, next) => {
  let username = req.params.username;
  let loggedInUser = req.user.userId;
  try {
    const followedUser = await User.findOne({ username: username });
    const currentUser = await User.findById(loggedInUser);
    if (!followedUser) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (currentUser.username === followedUser.username) {
      return res.status(400).json({ error: "you can't follow yourself" });
    }
    if (currentUser.following.includes(followedUser.id)) {
      return res.status(400).json({ error: 'you already follow this user' });
    } else {
      const user = await User.findByIdAndUpdate(
        loggedInUser,
        { $push: { following: followedUser.id } },
        { new: true }
      );
      res.status(201).json({
        msg: `${user.username} follow ${followedUser.username}`,
        profiles: {
          email: user.email,
          bio: user.bio,
          image: user.image,
          following: user.following,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
});

//unfollow  the user
router.get('/:username/unfollow', async (req, res, next) => {
  let username = req.params.username;
  let loggedInUser = req.user.userId;
  try {
    const unfollowedUser = await User.findOne({ username: username });
    const currentUser = await User.findById(loggedInUser);
    if (!unfollowedUser) {
      return res.status(400).json({ error: 'User not found' });
    } else {
      const user = await User.findByIdAndUpdate(
        loggedInUser,
        { $pull: { following: unfollowedUser.id } },
        { new: true }
      );
      res.status(201).json({
        msg: `${user.username} unfollowed ${unfollowedUser.username}`,
        profiles: {
          email: user.email,
          bio: user.bio,
          image: user.image,
          following: user.following,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
