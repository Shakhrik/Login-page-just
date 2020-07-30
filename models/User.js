const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
       
    },
    password:{
        type:String,
        required:true
    },
    emailVerificationToken:{
        type:String,
    },
    emailVerificationExpires:{
        type:Date,
    },
    resetPasswordToken:{
        type:String,
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    resetPasswordExpires:{
        type:Date,
    },
})

const User = mongoose.model('User', UserSchema)
module.exports = User