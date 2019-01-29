import React, { Component } from 'react';
import 'whatwg-fetch';

import { getFromStorage, setInStorage } from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      masterError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
    };

    this.onTextboxChange = this.onTextboxChange.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { signUpEmail, signUpPassword, signUpFirstName, signUpLastName } = this.state;

    this.setState({
      isLoading: true,
    });

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      })
      .catch(err => console.error('ERROR: ', err));
  }

  onSignIn() {
    // Grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true,
    });

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('the_main_app', { token: json.token } );
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      })
      .catch(err => console.error('ERROR: ', err));
    // Post request to back end
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {
      const { token } = obj;

      // Verify token
      fetch(`/api/account/verify?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false,
            });
          }
        });

    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  onTextboxChange(e) {
    let obj = {};
    let id = e.target.id;
    obj[id.toString()] = e.target.value;
    this.setState(obj);
  }

  render() {
    const {
      isLoading,
      token,
      signInEmail,
      signInPassword,
      signInError,
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
      signUpError,
    } = this.state;

    if (isLoading) {
      return (<p> Loading ... </p>);
    }

    if (!token) {
      return (<>
        <div>
          {
            (signInError) ? (
              <p>{signInError}</p>
            ) : null
          }
          <p>Sign in!</p>
          <input type="email" id="signInEmail" placeholder="Email" value={ signInEmail } onChange={ this.onTextboxChange } /><br />
          <input type="password" id="signInPassword" placeholder="Password" value={ signInPassword } onChange={ this.onTextboxChange } /><br />
          <button onClick={ this.onSignIn }>Sign in</button>
        </div>

        <div>
          {
            (signUpError) ? (
              <p>{signUpError}</p>
            ) : null
          }
          <p>Sign up!</p>
          <input type="firstName" id="signUpFirstName" placeholder="First name" value={ signUpFirstName } onChange={ this.onTextboxChange } /><br />
          <input type="lastName" id="signUpLastName" placeholder="Last name" value={ signUpLastName } onChange={ this.onTextboxChange } /><br />
          <input type="email" id="signUpEmail" placeholder="Email" value={ signUpEmail } onChange={ this.onTextboxChange } /><br />
          <input type="password" id="signUpPassword" placeholder="Password" value={ signUpPassword } onChange={ this.onTextboxChange } /><br />
          <button onClick={ this.onSignUp }>Sign up</button>
        </div>
      </>);
    }

    return (<>
      <p>Successfully logged in!!</p>
    </>);
  }
}

export default Home;
