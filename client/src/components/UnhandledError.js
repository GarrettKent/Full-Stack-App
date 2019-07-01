import React from 'react';
import {Link} from 'react-router-dom';

const unhandledError = () => {
  return (
    <div className="bounds">
      <h1>Error</h1>
      <p>Sorry! We just encountered an unexpected error.</p>
      <Link to="/">Return</Link>
    </div>
  )
}

export default unhandledError; 