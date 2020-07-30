const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const {VerificationEmail,PasswordChanged} = require('../helpers/sending-email')
const bcrypt = require("bcryptjs");

// GET/forgot
router.get('/',(req, res)=>{
    res.render('forgot')
} )


// POST/forgot
router.post('/', async(req, res)=>{
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');
    try{
    const user = await User.findOne({email:req.body.email})
        if(!user){
            req.flash('error', 'No account with this email')
            return res.redirect('/forgot')
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 180000 // 3min
        const saving = await user.save()

        if(saving){
            VerificationEmail(user, token)
            req.flash('success', 'Verification email is sent')
            res.redirect('/login')
        }else{
            console.log('Error',saving)
        }

    }catch(er){
        console.log('POST/forgot Error: ', er)
    }
})


router.get('/reset/:token', async(req,res)=>{
    try{
        const user = await User.findOne({resetPasswordToken:req.params.token,resetPasswordExpires:{$gt:Date.now()}});
        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('back')
        }
        res.render('reset', {token:req.params.token})
    }catch(er){
        console.log("GET/forgot/reset/:token error", er)
    }

})

router.post('/reset/:token', async(req, res)=>{
    try{
        const user = await User.findOne({resetPasswordToken:req.params.token,resetPasswordExpires:{$gt:Date.now()}});
        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('back')
        }
        if(req.body.password.length<6){
            req.flash('error', 'Password should be at least 7 characters')
            return res.redirect('back')
        }
        if(!req.body.password || !req.body.confirm){
            req.flash('error', 'Please fill these two fields');
            return res.redirect('back')
        }
        
        if (req.body.password === req.body.confirm){
            const salt = await bcrypt.genSalt(10);
            const hashedPasword = await bcrypt.hash(req.body.password, salt);

            user.resetPasswordExpires = undefined;
            user.resetPasswordToken = undefined;
            const saving = await user.save();
            if(saving){
                PasswordChanged(user)
                req.flash('success', 'Your password is changed');
                req.login(user, (err)=>{
                    if(err) {
                        console.log(err)
                        throw err
                    }
                res.redirect('/dashboard');

                });
            }else{
                console.log('ERROR', saving)
            }
        }else{
            req.flash('error', 'Password do not match');
            return res.redirect('back')
        }
    }catch(er){
        console.log(er)
    }
})


module.exports = router