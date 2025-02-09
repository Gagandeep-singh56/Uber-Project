const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
// will see cookie  and all differnce how sent we have seen will revise 
const userSchema=new mongoose.Schema({  
     fullname:{
        firstname:{
            type:String ,
            required:true,
            minlength:[3,"First name must be at least 3 characters long"]
        },  
        lastname:{
            type:String,
            minlength:[3,"Last name must be at least 3 characters long"]
        },
     },
     email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,"Email must be at least 5 characters long"],
     },
     password:{
        type:String,
        required:true,
        minlength:[9,'Min length should be 9 '],
        select:false,  //important to do galti se bhi code se bahar na aaje password 
        // how willthis work we will see 
        validate:[
            {
                validator:function(value){
                    return /\d/.test(value);
                },
                message:'Password must contain at least one numeric digit.'
            },
            {
                validator:function(value)
                {
                    return /[A-Z]/.test(value)
                },
                message:'Password must contain at least one uppercase letter.',
            }
        ],
     },
     SocketId:{
       type:String,
    //     for real time connections btw  2 client's 
     }

    }
     
)

// donot use arrow function they will take this from surrounding --laymen lang 
// use function() here
// these methods are binded to user from there id come 
userSchema.methods.generateAuthToken=function(){
    // use for ease of logging in 
    // it is exactly digital signature used for authentication and authorization purposes. 
    // wwe willl use private key  sign it and send  when it is sent to  server again then if  modified rejected
    // if same accepted 
    // it maybe symmetric 
    // or may be assymetric (public ,private both )as well if in case the user needs to verify it also can send public  key and let user verify the authenticity of message,
    // now  concept is super clear   
// mostly symmetric one private secret is used to send and verify the authenticity (that not altered same )
// assumption as digital signature  that  correct user sending that if hacker sends the right stealed token 
// we cannot differentiate that 
//  jwt=header ,payload,signature 
// is may user specic id 
// user instance(mongoose document or user object)** will call this function when entry in db is done id is automatically  generated  there
// now instance will caall this funtion it will have an id 

const token= jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
return  token;
// return "fhfhd";
}
// add try catch  everwhere nahi toh baad mein pta ni chalega kya fatgaya 
userSchema.methods.ComparePasswords= async function(password){
    try{
    return await bcrypt.compare(password,this.password);
    }catch(e){
        console.log(e);
        throw e;
    }
}
userSchema.methods.HashPassword=async function(password){
    return await bcrypt.hash(password,10);
}
const usermodel=mongoose.model('User',userSchema);
// Create the model from the schema
// Schema: Defines the structure of the data (i.e., the fields, their types, validation rules, etc.)
// Model: A Mongoose model is a wrapper around the schema that allows you to interact with the MongoDB collection (e.g., find, save, update document
module.exports=usermodel;
 

// to know in other file use 
// #important 
// const User=require('odel/User.model.js');
// User is an instance from db based on this file  (note it will have a id that moongoose gave it)
// const user = await User.findById(userId);
// // user will be an moonoose document like user object   so in other file this works like this 
// const token = user.generateAuthToken();


// thse model's will be used in controller's*****


// now we know how modl work.. concept super good..