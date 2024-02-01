// import React, { useEffect, useState } from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { firebaseAuth } from '../../RegistrationForm/firebase';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//     console.log(...rest);
//   const [user, setUser] = useState(null);
  
//     useEffect(() => {
//     const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
//       setUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         user ? <Component {...props} /> : <Navigate to="/" />
//       }
//     />
//   );
// };

// export default PrivateRoute;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuth } from '../../RegistrationForm/firebase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
