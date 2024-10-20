const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');

// CTF flag submission route
router.post('/submit', ensureAuthenticated, async (req, res) => {
  const { flag } = req.body;
  const userId = req.user.id;

  // Emit the flag submission through Socket.io (if needed)
  io.emit('submitFlag', { flag, userId });

  res.redirect('/dashboard'); // Redirect back to the dashboard
});

module.exports = router;
