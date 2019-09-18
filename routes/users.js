const express     = require('express')
const router      = express.Router();
const User        = require('../models/User')

const bcrypt     = require("bcryptjs");
const passport = require("passport");



router.get('/signup', (req,res,next) => {
  res.render('users/signup')
})

router.post('/signup', (req,res,next) => {

    let username = req.body.username
    let password = req.body.password
    let email = req.body.email

    const saltRounds = 10;


    const salt  = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    User.create({
      username: username,
      password: hash,
      email: email,
    }).then(data => {
      res.redirect("/user/login")

    }).catch(err => next(err))
})

router.get('/login', (req, res, next) => {
  res.render("users/login")
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/')
});


router.get('/secret', (req,res,next) => {

  if (req.session.currentUser) {
    res.render('users/secret', {theUser: req.session.currentUser})
  } else {
    res.redirect('/')
  }
})


module.exports = router;


