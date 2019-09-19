const express = require('express');
const router  = express.Router();

const User        = require('../models/User')

const bcrypt     = require("bcryptjs");
const passport = require("passport");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/movies",
    failureRedirect: "/user/login" // here you would redirect to the login page using traditional login approach
  })
);


module.exports = router;
