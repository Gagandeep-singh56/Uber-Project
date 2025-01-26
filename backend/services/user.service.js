// business level service level layer
const userModel=require('../models/user.model');

const connect=require('../db/db');
module.exports.createuser=async(firstname,lastname,email,password)=>{  //destructuring ..
    // why this ? ans = validation s done before are done for input formst there might be case thta  we are not
    // validating something andthat is required at business layer 
    if(!firstname || !email|| !password)
        throw new Error('All fields are required');

    // learning  from chatgpt we can use it in app.js 
    // app.use((err, req, res, next) => {
    //     console.error(err.message); // Log the error for debugging
    //     res.status(400).json({ error: err.message }); // Send a response to the client
    // });
    // Now, if throw new Error() is triggered anywhere in the app, the error-handling middleware will catch it.
    
    try{
        let con=await connect();
        console.log(con);
        // await will ensure promise resolve or reject tehn val is either assigned as req or catched
        // mongo main kuch likhne sehele ek baar connection hit krlo nhi toh dikkat aati hai
    const user= await userModel.create({
        fullname:{firstname,lastname},
        email,
        password
    });
    // console.log(user);
    return user;// resolve or reject will see in called function
}catch(e){
   console.log(e); 
//    validatioon error in model ,throw as we have res obj in controller
    throw e;
}
   
} 

// things that return promise are resolved or  rejected 