const express = require('express');
const router = express.Router();

var User = require('../models/Users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'respond with a resource' });
});

// registration handler
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    console.log(user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// login handler
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Invalid Password' });
    }
    // generate Token
    var token = await user.signToken();
    res.json({ user: user.userJSON(token)});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
