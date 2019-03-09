import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { getFromStorage, setInStorage } from '../../utils/storage';


class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '', 
      isLoading: false,
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signInError: '',
      justLoggedIn: false,
    };

    this.onTextboxChange = this.onTextboxChange.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
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
            justLoggedIn: true,
          });

        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      })
      .catch(err => console.error('ERROR: ', err));
  }

  onTextboxChange(e) {
    let obj = {};
    let id = e.target.id;
    obj[id.toString()] = e.target.value;
    this.setState(obj);
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
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });

    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const { signInError, signInEmail, signInPassword, token, justLoggedIn } = this.state;

    if (!token) {
      return (
        <div className='indent'>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : null
            }
            <p>Sign in!</p>
            <input type='email' id='signInEmail' placeholder='Email' value={ signInEmail } onChange={ this.onTextboxChange } /><br />
            <input type='password' id='signInPassword' placeholder='Password' value={ signInPassword } onChange={ this.onTextboxChange } /><br />
            <button onClick={ this.onSignIn }>Sign in</button>
        </div>
      );
    }

    if (justLoggedIn) {
      setTimeout(() => this.setState({ justLoggedIn: false }), 1000);

      return (
        <div className='indent'>
          <p>Successfully logged in.</p>
        </div>
      );
    }

    return <Redirect to='/' />;
  }

}

export default SignIn;
