import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className='indent'>
    <p>Page not found</p>

    <Link to="/">Go home</Link>
  </div>
);

export default NotFound;
