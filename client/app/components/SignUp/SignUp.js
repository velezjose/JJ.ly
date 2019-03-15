import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import LoadingSpinner from '../Loading/LoadingSpinner';
import { getFromStorage, setInStorage } from '../../utils/storage';


class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      token: '',
      signUpError: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      justSignedUp: false,
    };

    this.onTextboxChange = this.onTextboxChange.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onTextboxChange(e) {
    let obj = {};
    let id = e.target.id;
    obj[id.toString()] = e.target.value;
    this.setState(obj);
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
            justSignedUp: true,
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
    const { isLoading,
      signUpError,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      token,
      justSignedUp } = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!token) {
      return (
        <div className='indent'>
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
      );
    }  

    if (justSignedUp) {
      setTimeout(() => this.setState({ justSignedUp: false }), 1000);

      return (
        <div className='indent'>
          <p>Successfully signed up.</p>
        </div>
      );
    }

    return (<Redirect to='/signin' />);
  } 

}

export default SignUp;
