const jwt=require('jsonwebtoken');  
const User=require('../models/user.model');  
const blacklistedToken=require('../models/Blacklisted_tokens'); 
const Captain=require('../models/captain.model');
module.exports.authUser=async(req,res,next)=>{
   
    try{
        // console.log(req.headers);
        const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    
        if(!token)
        return res.status(401).json({error:"Access Denied"});

        const token_id= await blacklistedToken.findOne({token:token});

        if(token_id)
            return res.status(401).json({error:"Access Denied"});     
        

        const decoded=await jwt.verify(token,process.env.JWT_SECRET);
        // if not valid it will throw an error and will be caught in catch blockc
        // jwt works as it return the sended payload  as sent in req while signing 
        // so we can use it to get the user id
        const user=await User.findOne({_id:decoded._id});
         req.user=user;
         next();
    }catch(error)
    {
        console.log("Invalid token ",error);
        return  res.status(400).json({error:"Unauthorized Access"});
    }

}

module.exports.authCaptain=async(req,res,next)=>{
try{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];  
    if(!token)
    return res.status(401).json({error:"Access Denied"});

    const decoded=await jwt.verify(token,process.env.JWT_SECRET);     
    if(!decoded)
        return res.status(401).json({error:"Access Denied"});
// if logged out token is blacklisted   so check here
    const blacklisted=await blacklistedToken.findOne({token:token});    
    if(blacklisted)
        return res.status(401).json({error:"Access Denied"});

    const captain=await Captain.findOne({_id:decoded._id});    
    
    req.captain=captain;
    next();
}
catch(error)
{
    console.log("Some error in auth ",error);
    return  res.status(400).json({error:"Unauthorized Access"});    
}
}
