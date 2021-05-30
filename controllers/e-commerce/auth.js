const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const ejs = require("ejs");
const { validationResult } = require("express-validator/check");

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

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errorMessage,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });

}

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null;

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: errorMessage,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    },
    validationErrors: []
  });


}

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if ( !errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }


  User.findOne({email: email})
    .then(user => {

      if(!user) {
        
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: errors.array()
        });
      }

      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if(doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save( error => {
              console.log(error);
              res.redirect("/e-commerce/");
            });
            
          } else {
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Invalid email or password.',
              oldInput: {
                email: email,
                password: password
              },
              validationErrors: []
            });
          }
        })
        .catch( error => {
          console.log(error);
          res.redirect("/e-commerce/login")
        });
          
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
        name: name
      },
      validationErrors: errors.array()
    });
  }

  

  bcrypt.hash(password, 12)
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
        from:"raymondtyupri@hotmail.com",
        subject:"Sign up sucessfull",
        html: emailContent
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }

exports.postLogout = (req, res, next) => {
  console.log("loging out");
  console.log(req.session);
  req.session.destroy( error => {
    console.log(error);
    res.redirect("./")
  });
};



exports.getReset = (req, res, next) => {

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};



exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if ( err ) {
      console.log(err);
      return res.redirect('/e-commerce/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          res.redirect('/e-commerce/reset');
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        }

      })
      .then( result => {
        res.redirect('/e-commerce/');
        transporter.sendMail({

          to: req.body.email,
          from: 'raymondtyupri@hotmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:5000/e-commerce/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};


exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/e-commerce/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
