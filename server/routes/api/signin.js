const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports = (app) => {

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
    User.find({
      email
    }, (err, previousUsers) => {
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
      newUser.save((err, user) => {
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
  
};