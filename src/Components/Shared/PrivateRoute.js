
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Replace with your authentication context

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth(); // Get the current user from your authentication context
    console.log(currentUser);
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? <Component {...props} /> : <Redirect to="/" />;
      }}
    />
  );
};

export default PrivateRoute;
