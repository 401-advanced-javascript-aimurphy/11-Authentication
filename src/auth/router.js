'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');

//user.save is different than user referred to in the line 11. 11:10am
authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      // res.send SENDS JSON
      res.send(req.token);
    }).catch(next);
});

// bug here! post instead of get
authRouter.post('/signin', auth, (req, res, next) => {
  // the cookie is used to pass the token around and keep the session
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;
