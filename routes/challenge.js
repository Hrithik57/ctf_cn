const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/solve/:challengeId', async (req, res) => {
  const userId = req.user.id;
  const { challengeId } = req.params;
  // Assuming you check the solution for the challenge
  const isCorrect = true;  // Replace with actual check

  if (isCorrect) {
    await User.findByIdAndUpdate(userId, { $inc: { score: 10 } });
    res.send('Correct answer! Score updated.');
  } else {
    res.send('Wrong answer!');
  }
});

module.exports = router;
