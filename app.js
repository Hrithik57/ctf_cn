const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();
const authRoutes = require('./routes/auth'); // Adjust according to your folder structure
const path = require('path')
var cookieParser = require('cookie-parser')

// we need to store all the logged in users along with their scores somewhere
//let's put it in a file in the server side
//the file or array will look like
//{userobj1 score1 flagmap1} here flagmap1 will be a map that maps each flag to a 0-1 value; 1 if the flag was already guessed
//let's use an array for now

let store = []

corrflags= {"flag1": 10, "flag2": 20, "flag3": 30, "flag4": 40}

// MongoDB Connection
const mongoDBUri = 'mongodb://localhost:27017/ctf_platform'; // Use your local MongoDB URI

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecret', // Replace with your own secret
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/auth', authRoutes);

let topscorers = []

const loggedinMiddleware =  (req, res, next) => {
    const user = req.cookies.user;
    if(user){
        next();    
    }
    else{
        res.redirect('/auth/login')
    }
    
}

app.get('/dashboard', loggedinMiddleware,(req, res) => {
    const user = req.cookies.user
    console.log('req.cookies.user is', user)
    if(store.length >= 1){
        console.log('len > 1');
        console.log(store[0])
        console.log(Object.keys(store[0]))
    }
        
    // if(store.find((storeel)=>storeel["user"]._id == user._id) == false) {
    //     return ;
    // }
    flagmap = {}
    Object.keys(corrflags).forEach(element => {
        flagmap[element] = 0;
    });
    if(store.find((el)=>el['user']._id == user._id)){
        console.log('found!!!, will not add el twice');
    }
    else{
        store.push({"user": user, "score": 0, "flagmap":flagmap})
    }
    
    console.log('store is, ', store)
    res.render('dashboard', {"user": req.cookies.user, "leaders": store.sort(), "status_message": ""});
});


app.post('/submitflag', (req, res) => {
    console.log(req.body);
    const flag = req.body.flag;
    if(flag == undefined) return;
    store = store.map((el)=>{
        if(el.user._id == req.body.userId){
            //check if the flag is in the flagmap
            if(el['flagmap'].hasOwnProperty(flag)){
                if(el['flagmap'][flag] == 0){
                    el['flagmap'][flag] = 1;
                    el['score'] += corrflags[flag];
                }
                else{
                    //flag was already submitted
                }
            }
            return el;
        }
        return el;
    });
    res.redirect('/dashboard')
});

app.post('/endctf', (req, res) => {})

// Root route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the CTF Platform</h1><p><a href="/auth/login">Login</a> or <a href="/auth/register">Register</a></p>');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
