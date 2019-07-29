'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {
    // comes in as string we desturcture and split in to array so we can deal with the parts

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    console.log(req.headers.authorization);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=
    // authType is Basic, encodedString is ^; the brackets are not making array but destructuring the array that would've been

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        return _authError();
    }

  } catch(e) {
    return _authError();
  }

  function _authBasic(authString) {
    console.log('auth string🌟',authString);
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    console.log('bufferstring', bufferString)
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    // user can be either user or null based on the result coming back from usermodel method
    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  function _authenticate(user) {
    if ( user ) {
      // bugs --we need to generate token!
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

