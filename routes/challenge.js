const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/solve/:challengeId', async (req, res) => {
  const userId = req.user.id;
  const { challengeId } = req.params;
  // Assuming you check the solution for the challenge
  const isCorrect = true;  // Replace with actual check

  if (isCorrect) {
    // await User.findByIdAndUpdate(userId, { $inc: { score: 10 } });
    await User.findByIdAndUpdate(userId, {
      $inc: {
        score: 10,         // This updates the standalone 'score' field
        'user.score': 10   // This updates the nested 'user.score' field
      }
    });
    
    
    res.send('Correct answer! Score updated.');
  } else {
    res.send('Wrong answer!');
  }
});

module.exports = router;

