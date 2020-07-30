

// Cheching registration 
const checkRegistration = async(name, email, password, password2, Model) =>{
    let errors = [] 
    // Check required fields
     if(!name|| !email|| !password || !password2){
        errors.push({msg:'Please fill all fields'})
    }else if(password.length<6){
        console.log('Less than 6')
        // Password length
        errors.push({msg:'Password should be at least 7 characters'})
    }else if(password2 !== password){
        // Matching Password
        errors.push({msg:'Password do not match'})
    }else if(email){
        // Checking uniquiness of the email
        const user = await Model.findOne({email})
        if(user){
            errors.push({msg:'This email is already registered'})
        }
    }

    // Errors 
    if(errors.length > 0){
        return errors
    }else{
        return false
    }
}




module.exports = {
    checkRegistration,
    
}