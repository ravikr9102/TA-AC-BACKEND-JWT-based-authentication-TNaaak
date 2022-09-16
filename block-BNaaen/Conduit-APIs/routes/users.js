const express = require('express');
const router = express.Router();

const User = require('../models/User');

// registration handler
router.post('/register', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await user.signToken()
    res.status(201).json({ user: user.userJSON(token)});
  } catch (error) {
    next(error);
  }
});

// login handler
router.post('/login', async (req, res, next) => {
  try{
    let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/password required' });
  }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Invalid Password' });
    }
    var token = await user.signToken();
    console.log(token);
    res.json({ user: user.userJSON(token)});
  } catch (error) {
    next(error);
  }
});

router.post ('/allUsers', async ( req, res, next ) => {
  try {
      const user = await User.find();
      console.log(user);
      res.status(200).json({ user: user })
  } catch (error) {
      return next ( error )
  }
}); 

module.exports = router;
