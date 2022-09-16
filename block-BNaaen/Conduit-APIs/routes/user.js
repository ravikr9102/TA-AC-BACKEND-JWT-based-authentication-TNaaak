const express = require('express');
const router = express.Router();

const User = require('../models/User');
var auth = require('../middlewares/auth');

router.use(auth.verifyToken);

// current user display
router.get('/', async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    console.log(user, 'user');
    res.status(201).json({
      user: {
        email: user.email,
        token: req.headers.authorization,
        username: user.name,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// update a user
router.put('/', async (req, res, next) => {
  try {
    console.log(req.body);
    const updateUser = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateUser,
      { new: true }
    );
    res.status(201).json({
      user: {
        email: updatedUser.email,
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
