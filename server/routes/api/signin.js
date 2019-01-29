const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const Url = require('../../models/Url');

const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isValidUrl = url => {
  var re = /^(ftp|http|https):\/\/[^ "]+$/;
  return re.test(String(url).toLowerCase());;
};

const pad = n => {
  width = 5;
  z = '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

module.exports = (app) => {

  // Signing up creates a new user
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    let { firstName, lastName, email, password } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First name cannot be blank.',
      });
    }

    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: Last name cannot be blank.',
      });
    }
  
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.',
      });
    }
    
    email = email.toLowerCase();

    if (!isValidEmail(email)) {
      return res.send({
        success: false,
        message: 'Error: Email must be valid.',
      });
    }

    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.',
      });
    }

    // Verify email doesn't exist
    User.find({ email }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: User already exists.',
        });
      }

      // Creating new user
      const newUser = User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      
      // Saving new user
      newUser.save(err => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error',
          });
        }

        return res.send({
          success: true,
          message: 'Signed up!',
        });
      });
    });
  
  });
  

  // Signing in creates a new user session
  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    let { email, password } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.',
      });
    }

    email = email.toLowerCase();

    if (!isValidEmail(email)) {
      return res.send({
        success: false,
        message: 'Error: Email must be valid.',
      });
    }

    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.',
      });
    }

    User.find({ email }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.',
        });
      }

      if (users.length !== 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid email or password.',
        });
      }

      const user = users[0];
      const hashedPasswd = user.password;

      if (!user.validPassword(password, hashedPasswd)) {
        return res.send({
          success: false,
          message: 'Error: Invalid email or password.',
        });
      }

      // create user session
      let newUserSession = new UserSession();
      newUserSession.userId = user._id;

      // save new user session
      newUserSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error.',
          });
        }

        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id,
        });
      });

    });

  });


  // Verifies in user has a session
  app.get('/api/account/verify', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;

    // Verify the token is one of a kind and not deleted
    UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.'
        });
      }

      if (sessions.length !== 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid token.'
        });
      } else {
        return res.send({
          success: true,
          message: 'Found session.'
        });
      }
    });

  });


  // Logs out the user and changes their session's isDeleted property to true
  app.get('/api/account/logout', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;

    // Verify the token is one of a kind and not deleted
    UserSession.findOneAndUpdate({ _id: token, isDeleted: false }, { $set: { isDeleted: true } }, (err, session) => {
      if (err !== null) {
        return res.send({
          success: false,
          message: 'Error: Server error.'
        });
      }

      if (session === null || typeof session !== 'object') {
        return res.send({
          success: false,
          message: 'Error: Invalid token.'
        });
      } else {
        return res.send({
          success: true,
          message: 'Deleted session.'
        });
      }
    });

  });
  

  // Adds a new Url to schema
  app.post('/api/urls', (req, res, next) => {
    // Get the url
    const { body } = req;
    let { url } = body;

    if (!url) {
      return res.send({
        success: false,
        message: 'Error: URL must not be empty.',
      });
    }

    url = url.toLowerCase();

    if (!isValidUrl(url)) {
      return res.send({
        success: false,
        message: 'Error: URL must be valid.',
      });
    }


    Url.find({ url }, (err, urls) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.',
        });
      }

      if (urls.length !== 0) {
        return res.send({
          success: true,
          message: 'Already in database.',
        });
      }

      if (urls.length === 0) {
        let tinyUrl = 'http://jj.ly/' + pad(Math.floor(Math.random() * 10000));

        // Create new Url
        let newUrl = new Url();
        newUrl.tinyUrl = tinyUrl;
        newUrl.url = url;

        // save new url
        newUrl.save((err) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error.',
            });
          }
  
          return res.send({
            success: true,
            message: 'New url saved.',
          });
        });
      }

    });

  });


  app.get('/api/urls', (req, res, next) => {
    Url.find({}, (err, urls) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.',
        })
      }

      return res.send({
        success: true,
        message: 'Query successful.',
        urls
      });
    })
  });

};