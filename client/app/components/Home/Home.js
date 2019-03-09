import React, { Component } from 'react';
import LoadingSpinner from '../Loading/LoadingSpinner';
import 'whatwg-fetch';

import { getFromStorage } from '../../utils/storage';
import { timingSafeEqual } from 'crypto';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      token: '',
      masterError: '',
      tinyUrl: '',
      urls: [],
    };

    this.onLogout = this.onLogout.bind(this);
    this.makeNewTinyUrl = this.makeNewTinyUrl.bind(this);
    this.getUrls = this.getUrls.bind(this);
    this.onTextboxChange = this.onTextboxChange.bind(this);
  }


  onLogout() {
    this.setState({
      isLoading: true,
    });

    const { token } = this.state;

    // Verify token
    fetch(`/api/account/logout?token=${ token }`)
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.setState({
          token: '',
          isLoading: false,
        });
      }
    });
  }

  makeNewTinyUrl() {
    let { tinyUrl } = this.state;

    fetch('/api/urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: tinyUrl }),
    }).then(res => res.json())
    .then(json => {
      if (json.success) {
        let { urls } = json;
        this.getUrls();
      }
    });
  }


  getUrls() {
    fetch('/api/urls')
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.setState({
          urls: json.urls,
          tinyUrl: '',
        });
      }
    });
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
    const {
      token,
      isLoading,
      tinyUrl,
      urls
    } = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!token) {
      return (
        <section className='home indent'>
          <h1>
            Welcome to JJ.ly!
          </h1>

          <p>
            Shorten any URL into a 5-character hash.
          </p>
        </section>
      );
    }


    return (
      <section className='indent'>
        <div>
          <input type="tinyUrl" id="tinyUrl" placeholder="Enter URL to be shortened" value={ tinyUrl } onChange={ this.onTextboxChange } /><br />
          <button onClick={ this.makeNewTinyUrl }>Make new Tiny URL</button>
        </div>
        <br />

        <button onClick={ this.getUrls }>Get all urls</button>
        {
          (urls.length > 0) ?
            (
              <div>
                {
                  urls.map(record => (<>
                    <a href={ '/' + record.hash } target="_blank">{ 'http://jj.ly/' + record.hash }</a>
                    <br />
                  </>))
                }
              </div>
            )
          : null
        }

        <br />
        <button onClick={ this.onLogout }>Log out</button>
      </section>
    );
  }
}

export default Home;
