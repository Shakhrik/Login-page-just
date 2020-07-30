const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./helpers/passport')

const app = express()
//sessions
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true,
}));


// DB
mongoose.connect(process.env.MONGO_DB,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=> console.log('Mongodb is running...'))


// Passport configuration
app.use(passport.initialize());
app.use(passport.session());


// Handlebars
app.engine('.hbs', exphbs({defaultLayout:'main.hbs',extname:'.hbs'}))
app.set('view engine', '.hbs')



app.use(express.json())
app.use(express.urlencoded({extended:false}));


//Flash messages
app.use(flash())
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})


//Routes
app.use(require('./routes/index'));
app.use('/forgot', require('./routes/forgot'));
app.get('*', (req, res)=>{
    res.send('Error')
})
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('Server is running on ' + PORT)                                    
})