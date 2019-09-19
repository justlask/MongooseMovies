const express = require('express');
const router = express.Router();

const User = require('../models/User')



router.use((req,res,next) => {
  if (!req.user) {
    res.redirect("/user/login");
  }
  if (!req.user.isAdmin) {
    req.flash('error', 'you do not have access to this feature')
    res.redirect('/')
  }
  next();
})


router.get('/', (req,res,next) => {
  User.find().then(data => {
    res.render("users/admin", {users: data})
  })
})

router.post('/delete', (req,res,next) => {
  User.findByIdAndRemove(req.body.id).then(data => {
    res.redirect('/admin')
  }).catch(err => next(err))

})


router.post('/edit', (req,res,next) => {
  User.findById(req.body.id).then(data => {
    res.render('users/edit', data)
  })
})


router.post('/edit/user', (req,res,next) => {
  admin = req.body.admin? req.body.admin : false

  User.findByIdAndUpdate(req.body.id, {
    username: req.body.name,
    isAdmin: admin
  }).then(data => {
    req.flash('success', `${req.body.username} has been udpated`)
    res.redirect('/admin')
  }).catch(err => next(err))
})


module.exports = router;