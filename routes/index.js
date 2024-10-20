const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

// Home route
router.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;
  let errors = [];

  if (!username || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('register', { errors, username, password, password2 });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      errors.push({ msg: 'Username already exists' });
      return res.render('register', { errors, username, password, password2 });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Leaderboard route
router.get('/leaderboard', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 }).limit(10);
    res.render('leaderboard', { users });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
