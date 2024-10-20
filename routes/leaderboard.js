const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/leaderboard', async (req, res) => {
  const users = await User.find().sort({ score: -1 }).limit(10);
  res.render('leaderboard', { users });
});

module.exports = router;
