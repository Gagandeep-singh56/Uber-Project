const express=require('express');
const app=express();  

const dotenv=require('dotenv'); 
dotenv.config();
const connection=require('./db/db');
connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // to support encoded url text type to json
// add express.json() for parsing the req body as it was stringify before sending from the frontend  
// cross origin resource sharing only browser see(preflight call)  this postman and other extensions ignore this .
// const cors =require('cors');
// app.use(cors());  // as of now for * 
// will explore when we hot via some url bi toh port ko hi hit krre ho so not making sense  but it 
// awesome we will explore this  
const userRoutes= require('./routes/user.routes')
 
app.use('/users',userRoutes);

 
app.get('/',(req,res)=>{
res.send('hello world');
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
module.exports=app;

// more to read 

// // Middleware to parse JSON
// app.use(express.json()); // This internally uses body-parser.json()

// app.post('/data', (req, res) => {
//   console.log(req.body); // req.body will be a parsed JSON object
//   res.send('Received JSON data');
// });
// If the client sends a JSON payload like this:

// json

// {
//   "name": "John",
//   "age": 30
// }
// The req.body will be:


// {
//   name: 'John',
//   age: 30
// }

// internal impkemetation 
// What it does:
// It checks if the request has a Content-Type header of application/json.
// It reads the request's raw body as a stream of bytes.
// Then it converts that raw stream of bytes into a JSON object using JSON.parse().
// After parsing the body, it adds the parsed data to req.body, so that in your route handler, you can easily access the JSON content as an object.

// Reading the stream of data sent by the client in the HTTP request. This is typically done using Node.js's req.on('data') or req.on('end') events.
// Transforming the raw data based on the content type (application/json, application/x-www-form-urlencoded, etc.):
// For JSON: it uses JSON.parse() to convert the string into an object.
// For URL-encoded data: it uses querystring.parse() to convert it into an object.
// For raw data: it collects the raw bytes into a buffer.
// Adding the parsed data to the req.body property, which makes it easily accessible to your route handlers.
// If the data is too large or malformed, it can trigger errors that you can catch and handle in your Express app.


// also see multer middleware for file reading 