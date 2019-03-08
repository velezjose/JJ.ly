import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <Link to="/">Home</Link>
    <Link to="/signin">Sign In</Link>
    <Link to="/signup">Sign Up</Link>
  </header>
);

export default Header;
