const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {checkRegistration} = require('../helpers/register-check');
const {RegistrationEmail} = require('../helpers/sending-email');
const crypto = require('crypto');
const passport = require('passport');
const {isAuth, isGuest} = require('../midleware/auth')




router.get('/',isGuest, (req, res)=>{
    res.render('homepage', {
        
    })
})
router.get('/register', isGuest,(req, res)=>res.render('register'))


// Post
router.post('/register', async(req,res)=>{
    const  {email, password, password2, name} = req.body
    
    console.log(req.body)
    const errors = await checkRegistration(name,email, password, password2, User);
    // console.log(errors)
    if(errors){
        console.log('checking')
        res.render('register', {
            errors,
            email, 
            password,
            password2,
            name
        })
    }
    else{
        // console.log('else statement')
        const user = new User({
            name,
            email,
            password
        })
        try{
        // Hash password 
        const salt = await bcrypt.genSalt(10)
        const hashedPasword = await bcrypt.hash(password, salt)

        // Create token for email verification
        const buffer = crypto.randomBytes(20)
        const token = buffer.toString('hex')
        console.log('Token:',token)
        


        user.password = hashedPasword;
        user.emailVerificationToken = token;
        user.emailVerificationExpires = Date.now() + 180000 // 3 min
        const saving = await user.save()
        RegistrationEmail(user, token)
        if(saving){
            setTimeout(()=>{
            User.findOneAndDelete({emailVerificationToken:token,isVerify:false, emailVerificationExpires:{$lt:Date.now()}})
            .then(success=>{
                if(success)
                console.log('Not verified User is deleted!!!', success)
                else
                console.log('User is verified')
                
            }).catch(er=>{
                console.log('Not verified user error:', er)
            })
            },210000)
            req.flash('success', 'Check your email and verify in order to be completely registered')
            res.redirect('/login')
        }
        }catch(er){
            console.log(er)
        }
    }
    
})

router.get('/login',isGuest, (req, res)=>
{
    res.render('login')
})
router.get("/dashboard", isAuth,(req, res)=>{
    console.log('Req.user:', req.user)
    console.log('Is Authenticated:',req.isAuthenticated())
    res.render('dashboard')
})


// Email verification
router.get('/email-verification/:token', async (req, res)=>{
    const user = await User.findOne({emailVerificationToken:req.params.token, emailVerificationExpires:{$gt:Date.now()}})
    try{
    if(!user){
        req.flash('error', 'Verification link is invalid or has expired')
        return res.redirect('/login')
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.isVerify = true;
    const saving = await user.save()
    if(saving){
        req.flash('success', 'Verified')
        res.redirect('/login')
    }
    }catch(er){
        console.log(er)
    }
})


// Login Handle

router.post('/login', passport.authenticate('local', {
    failureRedirect:'/login',
    failureFlash:true
}), (req, res)=>{
    res.redirect('/dashboard')
}
)

// Logout Handle
router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/login')
})
module.exports = router