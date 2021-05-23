const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const ejs = require("ejs");

const path = require('path');



const User = require("../../models/e-comerce/user");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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",
  }
}))


exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null;

  res.render("auth/login", {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errorMessage
  })

}

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null;

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: errorMessage
  });


}

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {

      if(!user) {
        req.flash("error", "Invalid email or password");
        res.redirect("/e-commerce/login");
      }

      bcrypt.compare(password, user.password)
        .then(doMatch => {
          console.log(doMatch);
          if(doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save( error => {
              console.log(error);
              res.redirect("/e-commerce/");
            });
            
          } else {
            req.flash("error", "Invalid email or password");
            res.redirect("/e-commerce/login");
          }
        })
        .catch( error => {
          console.log(error);
          res.redirect("/e-commerce/login")
        });
          
    })
    .catch(err => console.log(err));

};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email:email})
    .then( userDoc => {
      if(userDoc) {
        req.flash("error", "E-mail already exists. Please pick a different e-mail");
        return res.redirect("/e-commerce/signup");
      }

      return bcrypt.hash(password, 12)
        .then( hashedPassword => {
          const newUser = new User({
            email:email,
            name: name,
            password:hashedPassword,
            cart:{items:[]}
          });
    
          return newUser.save();
        })
        .then( async () => {
          res.redirect("/e-commerce/login");
          const p = path.join(
            path.dirname(process.mainModule.filename),
            'views',
            'signUpEmail.ejs'
          );

          const emailContent = await ejs.renderFile(p, {name: name});
          console.log(emailContent);
            
          transporter.sendMail({
            to:email,
            from:"hernan.yupanqui.prieto@gmail.com",
            subject:"Sign up sucessfull",
            html: emailContent
          });
        })
        .catch( error => console.log(error));
    })
    .catch(error => console.log(error)
  );
}

exports.postLogout = (req, res, next) => {
  console.log("loging out");
  console.log(req.session);
  req.session.destroy( error => {
    console.log(error);
    res.redirect("./")
  });
}

