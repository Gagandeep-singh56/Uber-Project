const captainservice=require('../services/captain.service');
const{validationResult}=require('express-validator');
const CaptainModel=require('../models/captain.model');                  
const Blacklisted_tokens = require('../models/Blacklisted_tokens');
module.exports.registercaptain=async(req,res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {fullname,email,password,vechile}= req.body;
    if(!fullname ||!email ||!password ||!vechile)
    {
        return res.status(400).send("Please fill all the fields");  
    }
 try{
 
    const find=await CaptainModel.findOne({email:email});
    if(find)
    {
        return res.status(400).send("Captain already exists");
    }   
    // // hash password 
    const hashedPassword = await CaptainModel.prototype.HashPassword(password);

   const captain=  await captainservice.registercaptain(fullname,email ,hashedPassword,vechile); 
   console.log(captain)
   const token= await captain.generateAuthToken();
    res.cookie('token',token,{
         httpOnly:true,
         secure:true,
         sameSite:'none',
    }); 
    return res.status(201).send({success:"Captain Registered Successfully",token:token,captain:captain});
 }
 catch(error)
 {  
      console.log("error while creating captain",error);
      return res.status(404).send("Error while Registering captain");   
 }

}

module.exports.logincaptain=async(req,res)=>{
    const errors=validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
     try{
        const {email,password}=req.body;
        const captain=await CaptainModel.findOne({email:email}).select('+password');  
        if(!captain)
            return res.status(401).json({error:"Either email or Password does not match"});
        const comparepasswords=await captain.ComparePasswords(password);
 
        if(!comparepasswords)
            return res.status(401).json({error:"Either email or Password does not match"});
        const token =await captain.generateAuthToken();
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
        });
        return res.status(200).send({success:"Captain Logged in Successfully",token:token,captain:captain});
     }catch(error)
     {
            console.log("error while logging in captain",error);
            return res.status(404).send("Error while logging in captain");
     }
}

module.exports.getprofile=async(req,res)=>{
    try{
    return res.status(200).json({Captain:req.captain}); 
    }catch(error)
    {
        console.log("error while getting captain profile",error);
        return res.status(404).send("Error while getting captain profile");
    }   
}
module.exports.logout=async(req,res)=>{
    try{
        await Blacklisted_tokens.create({token:req.cookies.token});
        res.clearCookie('token');
        return res.status(200).json({success:"Captain Logged out successfully"});   
    } 
    catch(error)
    {
        console.log("error while logging out captain",error);
        return res.status(404).send("Error while logging out captain");
    }

}
