# JJ.ly URL Shortening Service

Homepage (not logged in):
![alt text](/screenshots/homepage.png "Homepage of JJ.ly") <!-- .element width="270px" height="287px" -->

Sign up page:
![alt text](/screenshots/sign-up-page.png "Sign up page") <!-- .element width="270px" height="300px" -->

Sign in page:
![alt text](/screenshots/sign-in-page.png "Sign in page") <!-- .element width="270px" height="300px" -->

Dashboard:
![alt text](/screenshots/dashboard-1.png "Dashboard page") <!-- .element width="270px" height="300px" -->

Creating a tiny URL:
![alt text](/screenshots/dashboard-2.png "Creating a tiny URL") <!-- .element width="270px" height="300px" -->

All currently stored tiny URLs:
![alt text](/screenshots/tiny-urls.png "Displaying all currently URL") <!-- .element width="270px" height="300px" -->


## About

JJ.ly is a fullstack URL shortening service built using the MERN stack. It has user profiles, creates user sessions,
stores tokens in localStorags and verifies identity with these. There Home/Dashboard routes, Sign In and Sign Up routes.
It uses npm's bcrypt library to hash passwords and stores into the database.

For now, it's an MVP focused on minimalism. Check it out for yourself!



## Stack
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation


## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```


## Running

Make sure to add a `config.js` file in the `config` folder. See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```
