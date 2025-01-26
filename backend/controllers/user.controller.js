const userModel=require('../models/user.model.js');

// flowchart ,readme.md  
// const CreateUser=require('../Service/user.Service.js');
const CreateUser=require('../services/user.service.js')
const {validationResult}=require('express-validator')
// why async?

module.exports.registeruser= async(req,res,next)=>{
//this will handle validation error ,but the model validation is not handled and give error in console 
// resulting in not connection
    const errors=validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

   

    const {fullname,email,password}=req.body;
    // const hashedpassword=await userModel.HashPassword(password);
    const hashedPassword = await userModel.prototype.HashPassword(password);  // Fix here
    const firstname=fullname.firstname;
    const lastname=  fullname.lastname;
    
    try{
    const user = await CreateUser.createuser(firstname,lastname,email,hashedPassword);
     // till await is written it will not exec the next statement as it wiats for the promise to relove or reject
     console.log(user)
     const token= user.generateAuthToken(); //called on instance  {real user}
     res.status(200).json({success:'User registered successfully',user,token})
 
    }catch(e){
       return res.status(400).json({error:e})
    }
   


    
} 