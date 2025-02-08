// Without Express Validator, the client can send invalid data directly to the server. This would mean that Mongoose would be the only layer performing validation, and it could result in errors when trying to save invalid data. Express Validator provides an early checkpoint to reject invalid data before hitting the database.

// When to use both:
// Express Validator is used for early validation of the incoming HTTP request data.
// Mongoose validation is used for data integrity and ensuring that data is consistent when interacting with your MongoDB database.

// express validator is an middleware 
// middleware (mvc?    will see theory)


const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const userController=require('../controllers/user.controller')
// The body function specifically is used to validate the fields in the request body  
// so express-validato irs an middleware ok .
// input validation

// create doc for github
router.post('/register',
    [body('fullname.firstname').isLength({min:3}).withMessage('firstname must have an length of 3'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:9}).withMessage('Atleast 9 char and rules* must be satisfied')
    ],userController.registeruser)

router.post('/login',[body('email').isEmail().withMessage('Invalid Email'),body('password').isLength({min:9}).withMessage('Atleast 9 char is required')],userController.loginuser);

module.exports=router;

