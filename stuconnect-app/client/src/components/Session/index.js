import React from 'react';

const requireAuth = () => {
  if(!localStorage.getItem('token')) {
    // go to login route
  }
  // stay on this route since the user is authenticated
}

const verifyAuth = () => {
  if(localStorage.getItem('token')) {
    // go to your dashboard or home route
  }
  // stay on this route since the user is not authenticated
}

// Refresh the token according to the server expiration time