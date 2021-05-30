const express = require('express');
const { check, body } = require("express-validator/check");
const { Promise } = require('mongoose');

const authController = require('../../controllers/e-commerce/auth');
const User = require("../../models/e-comerce/user");

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login'
  , [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'The password is not valid.')
      .isLength({ min: 5 })
      .isAlphanumeric() 
      .trim()
  ]
  , authController.postLogin
);

router.post('/signup'
  , [ check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value , {req}) => {
      return User.findOne({email:req.body.email})
        .then( userDoc => {
          if(userDoc) {
            return Promise.reject("E-mail already exists. Please pick a different e-mail");            
          }
        });
    })
    , body("password", "Please enter a passwords with only numbers and text and at least 5 characters.")
      .isLength({min: 5})
      .isAlphanumeric()
    , body("confirmPassword")
      .trim()
      .custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!")
        }

        return true;
      })
    ]
  
  , authController.postSignup);

router.post('/logout', authController.postLogout);

router.get("/reset", authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);



module.exports = router;   