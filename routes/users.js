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


router.use((req,res,next) => {
  if (!req.user) {
    res.redirect("/user/login");
  }
  next();
})

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



router.get('/profile', (req, res, next) => {
  res.render('users/profile')
})


router.post("/delete", (req,res,next) => {
  console.log(req.user.id)
  User.findByIdAndRemove(req.user.id).then(data => {
    req.logout();
    res.redirect("/user/bye")
  }).catch(err => next(err))
})

router.get("/bye", (req,res,next) => {
  res.render("users/delete")
})


router.get("/update", (req,res,next) => {
  res.render("users/update")
})


router.post("/update", (req,res,next) => {

  let id = req.user.id
  let name = req.body.name;
  let email = req.body.email;
  let oldpass = req.body.oldpass;
  let newpass = req.body.newpass;


  if (req.user.googleID) {
    User.findByIdAndUpdate(id, {
      username: name,
      email: email,
    }).then(data => {
      req.flash('success', "you've changed your info!")
      res.redirect('/user/profile')
  
    }).catch(err => next(err))
  }

  else {
    const saltRounds = 10;

    const salt  = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(newpass, salt);
  
  
    if (!bcrypt.compareSync(oldpass, req.user.password)) {
      req.flash('error', `your old password is incorrect`)
      res.redirect('/user/profile')
    }
  
    if (bcrypt.compareSync(oldpass, req.user.password)) {
      User.findByIdAndUpdate(id, {
        username: name,
        email: email,
        password: hashPass
  
      }).then(data => {
        req.flash('success', "you've changed your info!")
        res.redirect('/user/profile')
      }).catch(err => next(err))
    }
  }
})




module.exports = router;


