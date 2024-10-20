const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/User');
var dayjs = require('dayjs');

// Registration route
router.get('/register', (req, res) => {
    res.render('register', { messages: { error: [], success: [] } });
});

// Registration logic
router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;
    let messages = { error: [], success: [] };

    // Check for empty fields
    if (!username || !password || !password2) {
        messages.error.push('Please fill in all fields');
        return res.render('register', { messages });
    }

    // Check if passwords match
    if (password !== password2) {
        messages.error.push('Passwords do not match');
        return res.render('register', { messages });
    }

    const newUser = new User({ username, password });

    try {
        await newUser.save();
        messages.success.push('You are now registered and can log in');
        res.render('login', { messages }); // Redirect to login page with success message
    } catch (err) {
        console.error(err);
        messages.error.push('Username already exists');
        return res.render('register', { messages });
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login', { messages: { error: [], success: [] } });
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    let messages = { error: [], success: [] };

    // Check for empty fields
    if (!username || !password) {
        messages.error.push('Please fill in all fields');
        return res.render('login', { messages });
    }

    // Attempt to log the user in
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log(err)
            messages.error.push('An error occurred, please try again.');
            return res.render('login', { messages });
        }
        if (!user) {
            messages.error.push('Invalid username or password');
            return res.render('login', { messages });
        }
        req.logIn(user, (err) => {
            if (err) {
                messages.error.push('An error occurred, please try again.');
                return res.render('login', { messages });
            }
            messages.success.push('You are now logged in');
            res.cookie("user", user, {
                httpOnly: false,
                expires: dayjs().add(30, "days").toDate(),
            });
            return res.redirect('/dashboard'); // Redirect to dashboard or wherever you want
        });
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/'); // Redirect to homepage after logout
    });
});

module.exports = router;
