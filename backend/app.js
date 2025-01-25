const express=require('express');
const app=express();  

const dotenv=require('dotenv'); 
dotenv.config();

// cross origin resource sharing only browser see(preflight call)  this postman and other extensions ignore this .
const cors =require('cors');
app.use(cors());  // as of now for * 
// will explore when we hot via some url bi toh port ko hi hit krre ho so not making sense  but it 
// awesome we will explore this 


app.get('/',(req,res)=>{
res.send('hello world');
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
module.exports=app;