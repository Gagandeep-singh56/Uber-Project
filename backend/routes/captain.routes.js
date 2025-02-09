const router = require('express').Router(); 
const captainController=require('../controllers/captain.controller');
const {body}=require('express-validator');

const authMiddleware=require('../middlewares/auth.middleware'); 

router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('firstname must have a length of 3'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 9 }).withMessage('At least 9 characters and rules* must be satisfied'),
    body('vechile.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters'),
    body('vechile.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters'),
    body('vechile.Vechiletype').isIn(['bike', 'car', 'auto']).withMessage('Invalid Vechiletype'),
    body('vechile.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
], captainController.registercaptain);

router.post('/login', [body('email').isEmail().withMessage('Invalid Email'), body('password').isLength({ min: 9 }).withMessage('At least 9 char is required')], captainController.logincaptain);

router.get('/profile',authMiddleware.authCaptain,captainController.getprofile); 

router.post('/logout', captainController.logout);

module.exports=router;