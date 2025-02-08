const userModel=require('../models/user.model.js');
const blacklistedToken=require('../models/Blacklisted_tokens.js');  
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
module.exports.loginuser= async(req,res,next)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty())
         return res.status(400).json({errors: errors.array()});

    const{email,password}=req.body;
    
    try{
        result=await userModel.findOne({email:email}).select('+password');
        // result will be an mongoose document 

        if(!result)
            return res.status(401).json({error:"Either email or Password does not match"});
       
        const comparepasswords=await result.ComparePasswords(password); 
        if(!comparepasswords)
            return res.status(401).json({error:"Either email or Password does not match"});

        const token =result.generateAuthToken();
        //yes token is sent here also think it is needed 
        // token sent as secret is with us so no need to store token we can just validate it when it come.

        res.cookie('token', token, {
            httpOnly: true, // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'Strict', // Prevent CSRF attacks
        });
        return res.status(200).json({success:"You are successfully Logged In",Token:token});

    } catch(e)
    {
        return res.status(400).json({err:"i am here"});
    }

}

module.exports.getprofile= async(req,res,next)=>{ 
    return res.status(200).json({User:req.user});
}

module.exports.logout=async(req,res,next)=>{
    // see by clearing the cookie the token is cleared from clientside and now he needs to login again  to send new  token but note the token if he stored prevoiuly  is still valid{if not expired automatically acc to max live time we can give is  24 hrs*  or even he has logged in again previous token may be valid } and maybe used to login again  soto handle this issue we blacllist thetoken in   db a and will keep in db upto 24 hrs that is max time for toke to live automatically ,now wif user logout we will blacklist the token in db and he will not be able to login via that token but as db is limited we cannot store the token infinitely  so we will use  this 24 hr limit that we will also delete blacklisted token from db after 24 hrs .  
    // so for this we need a new model blacklist   when logging out we will add the token to blacklist and when logging in we will checkin auth middleware if token is in blacklist or not  if it is  blacklisted access is denies else he will continue as in nirmal flow for every api  that token verifies user ..
try{
const token=await blacklistedToken.create({token:req.cookies.token});   
// console.log(token);        
res.clearCookie('token');
return res.status(200).json({success:"Logged out successfully"});  
}
catch(error)
{
    console.log(error);         
}

}