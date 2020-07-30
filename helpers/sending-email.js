const nodemailer = require('nodemailer');

const RegistrationEmail = (user, token)=>{
    // Step 1
    let transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.USER,
            pass:process.env.PASSWORD,
        }
    });
    // Step 2
    let mailOptions = {
        from:'mynotes.techsup@gmail.com',
        to:user.email,
        subject:'Note.com verification',
        text:'Thank you for registiring to our account. Please click below in order to verify\n' +
        'http://localhost:5000/email-verification/' + token,
        html:'<h1>Thank you for registiring to our account</h1> '+ 
        '<h2> Please click below for verification \n' +
        '<a href="http://localhost:5000/email-verification/' + token + '">'+'Verify</a>'
    };

    // Step 3
    transport.sendMail(mailOptions, (err)=>{
        if(err) {
            console.log(err)
            throw err
            
        }
        else console.log('Email sent!!!')
    })

}



const PasswordChanged = (user)=>{
        // Step 1
        let transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.USER,
                pass:process.env.PASSWORD
            }
        });
        // Step 2
        let mailOptions = {
            from:'mynotes.techsup@gmail.com',
            to:user.email,
            subject:'Password chanded',
            text:'Your password is changed successfully',
            html:
            '<h2> Your password is changed successfully'
        };
    
        // Step 3
        transport.sendMail(mailOptions, (err)=>{
            if(err) {
                console.log(err)
                throw err
                
            }
            else console.log('Reset Password Email sent!!!')
        })
    
    }


    const VerificationEmail = (user, token)=>{
        // Step 1
        let transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.USER,
                pass:process.env.PASSWORD
            }
        });
        // Step 2
        let mailOptions = {
            from:'mynotes.techsup@gmail.com',
            to:user.email,
            subject:'Password changing verification',
            text:'Please click below in order to verify\n' +
            'http://localhost:5000/forgot/reset/' + token,
            html:
            '<h2> Please click below for verification \n' +
            '<a href="http://localhost:5000/forgot/reset/' + token + '">'+'Verify</a>'
        };
    
        // Step 3
        transport.sendMail(mailOptions, (err)=>{
            if(err) {
                console.log(err)
                throw err
                
            }
            else console.log('Reset Password Email sent!!!')
        })
    
    }

module.exports = {
    RegistrationEmail,
    VerificationEmail,
    PasswordChanged
}