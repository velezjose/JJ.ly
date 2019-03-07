const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const { isValidEmail } = require('../../utils/validators.js');

module.exports = (app) => {

  // Signing up creates a new user
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    let { firstName, lastName, email, password } = body;

    if (!firstName) {
      return res.status(400).send({
        success: false,
        message: 'Error: First name cannot be blank.',
      });
    }

    if (!lastName) {
      return res.status(400).send({
        success: false,
        message: 'Error: Last name cannot be blank.',
      });
    }
  
    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Error: Email cannot be blank.',
      });
    }
    
    email = email.toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).send({
        success: false,
        message: 'Error: Email must be valid.',
      });
    }

    if (!password) {
      return res.status(400).send({
        success: false,
        message: 'Error: Password cannot be blank.',
      });
    }

    // Verify email doesn't exist
    User.find({ email }, (err, previousUsers) => {
      if (err) {
        return res.status(503).send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.status(406).send({
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
          return res.status(500).send({
            success: false,
            message: 'Error: Server error',
          });
        }

        return res.status(201).send({
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
      return res.status(400).send({
        success: false,
        message: 'Error: Email cannot be blank.',
      });
    }

    email = email.toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).send({
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
        return res.status(500).send({
          success: false,
          message: 'Error: Server error.',
        });
      }

      if (users.length !== 1) {
        return res.status(400).send({
          success: false,
          message: 'Error: Invalid email or password.',
        });
      }

      const user = users[0];
      const hashedPasswd = user.password;

      if (!user.validPassword(password, hashedPasswd)) {
        return res.status(400).send({
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
          return res.status(500).send({
            success: false,
            message: 'Error: Server error.',
          });
        }

        return res.status(202).send({
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
        return res.status(500).send({
          success: false,
          message: 'Error: Server error.'
        });
      }

      if (sessions.length !== 1) {
        return res.status(400).send({
          success: false,
          message: 'Error: Invalid token.'
        });
      } else {
        return res.status(202).send({
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
        return res.status(500).send({
          success: false,
          message: 'Error: Server error.'
        });
      }

      if (session === null || typeof session !== 'object') {
        return res.status(500).send({
          success: false,
          message: 'Error: Invalid token.'
        });
      } else {
        return res.status(200).send({
          success: true,
          message: 'Deleted session.'
        });
      }
    });

  });

};