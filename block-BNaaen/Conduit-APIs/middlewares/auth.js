var jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: async (req, res, next) => {
    console.log(req.headers);
    var token = req.headers.authorization;
    try {
      if (token) {
        var payload = await jwt.verify(token, process.env.SECRET);
        req.user = payload;
        next();
      } else {
        res.status(400).json({ error: 'token required' });
      }
    } catch (error) {
      next(error);
    }
  },

  authorizeOptional: async (req, res, next) => {
    const token = req.headers.authorization;
    try {
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        req.user = payload;
        next();
      } else {
        next();
      }
    } catch (error) {
      return next(error);
    }
  },
};
