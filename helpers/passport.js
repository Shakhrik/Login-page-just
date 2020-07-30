const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User')

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{

    User.findById(id,(err, user)=>{
        done(err, user);
    })
})
passport.use(new LocalStrategy({usernameField:'email'},async(email, password, done)=>{
    try{
    // Match email
    const user = await User.findOne({email, isVerify:true})
    if(!user){
        console.log('User is not found');
        return done(null, false, {message:'This email is not registered'})
    }
    // Match password
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return done(null, false, {message:'Password is incorrect'})
    }
    return done(null, user)

    }catch(er){
        console.log(er)
    }
}))
