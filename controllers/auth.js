const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const { expressjwt: jwtt } = require("express-jwt");


// Create Signup request

exports.signup = (req, res) => {
    // const {name, email, password} = req.body
    // res.json({
    //     user: {name, email, password}
    // })
    User.findOne({email: req.body.email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

      const {name, email, password} = req.body;
      console.log(name, email, password)

      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      let newUser = new User({name, email, password, profile, username});
      newUser.save((err, success) => {
          if(err) {
              return res.status(400).json({
                  error: err
              })
          }
          res.json({
              user: success
          });
        //   res.json({
        //       message: 'Signup success! Please signin.'
        //   })
      })
    });
};

// Create Signin request

exports.signin = (req, res) => {

    const {email, password} = req.body

    // Check if user exist
    User.findOne({email}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist, Please signup.'
            });
        }
        // Authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }
        // Genarate a token and send to client
        const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {expiresIn: '7d'})
        const {_id, username, name, email, role} = user;
        return res.json({
            token,
            user: {_id, username, name, email, role}
        })
    });
    
};

// Create Signout request

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json ({
        message: 'Signout success'
    });
};

// exports.requireSignin = expressJwt({
//     secret: process.env.JWT_SECRET
// });

exports.requireSignin = jwtt({
    secret: process.env.JWT_SECRET,
    // algorithms: ["HS256"], // added later
    // function (req, res) {
    //     if (!req.auth) return res.sendStatus(401);
    //     res.sendStatus(200);
    //   }
    userProperty: "auth",
    algorithms: ["HS256"]
  });


  // Auth Middleware

  exports.authMiddleware = (req, res, next) => {
      const authUserId = req.user._id;
      User.findById({_id: authUserId}).exec((err, user) => {
          if(err || !user) {
              return res.status(400).json({
                  error: 'User not found'
              });
          }
          req.profile = user;
          next();
      });
  };

  // Admin Middleware
 
  exports.adminMiddleware = (req, res, next) => {
      const adminUserId = req.user._id;
      User.findById({_id: adminUserId}).exec((err, user) => {
          if(err || !user) {
              return res.status(400).json({
                  error: 'User not found'
              });
          }

          if(user.role !== 1) {
            return res.status(400).json({
                error: 'Admin Resource Access Denied'
            });
          }
          req.profile = user;
          next();
      });
  };