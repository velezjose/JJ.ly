# JJ.ly URL Shortening Service

Homepage (not logged in):
<img src="/screenshots/homepage.png" alt="Homepage of JJ.ly" width="270px" height="287px">

Sign up page:
<img src="/screenshots/sign-up-page.png" alt="Sign up page" width="270px" height="300px">

Sign in page:
<img src="/screenshots/sign-in-page.png" alt="Sign in page" width="270px" height="300px">

Dashboard:
<img src="/screenshots/dashboard-1.png" alt="Dashboard page" width="270px" height="300px">

Creating a tiny URL:
<img src="/screenshots/dashboard-2.png" alt="Creating a tiny URL" width="270px" height="300px">

All currently stored tiny URLs:
<img src="/screenshots/tiny-urls.png" alt="Displaying all currently URL" width="270px" height="300px">


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
