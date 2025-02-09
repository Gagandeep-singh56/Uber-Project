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
const authMiddleware=require('../middlewares/auth.middleware');
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


router.get('/profile',authMiddleware.authUser,userController.getprofile);

router.post('/logout',userController.logout);
// as of current implementation one user  can login in  many times as all tokens willlbe valid tokens so if one logs out other token will be working till its expire time hits   so we can add functionallity to support one one login setup and user needs to logout inorder to login again in that case 
// if token of the user lost somehow while he is logged in then in that case   he  cannot logout and caanot login again in other device so he need to wait till token get expirred and he needs to login again which happens many a time with us ..

// note token is very important and it must be keptt secure it it  is shred and exposed then everything is at stake .
// Use httpOnly Cookies
// Store tokens in httpOnly cookies rather than localStorage or sessionStorage.
// Why?
// HttpOnly cookies cannot be accessed via JavaScript, reducing the risk of XSS (Cross-Site Scripting) attacks.

// that is why in transaction extra otp is req for auth. 



module.exports=router;

// kahani

