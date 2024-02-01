import React from "react";
import { useRoutes, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoginPage from "./Components/LoginPage";
import Layout from "./Components/Shared/Layout";
import Menu1 from "./Components/Menu1";
import Menu2 from "./Components/Menu2";
import Registration from "./RegistrationForm/Registration";
import EditUser from "./RegistrationForm/EditUser";
import ThankYouPage from "./Components/ThankYouPage";
import { firebaseAuth } from "./RegistrationForm/firebase";

const PrivateRoute = ({ element }) => {
  // e.preventDefault();
  // Implement your authentication logic here
  console.log(element);
  const isAuthenticated = firebaseAuth.currentUser !== null ;
  console.log(isAuthenticated);
  localStorage.setItem('isAuthenticated', isAuthenticated)
  const storedAuth = localStorage.getItem('isAuthenticated')
  // const navigate = useNavigate()
  // if (!storedAuth) {
  //   <Navigate to={'/'}/>  
  //   // navigate('/')
  // }
  // else if (storedAuth == true) {
  //   return element;
  // }
  // else{
  //     return element  
  // }

  return storedAuth ? (
    element
  ) : (
    <Navigate to="/" />
  );
};

const Router = () => {
  const routes = useRoutes([
    { path: '/', element: <LoginPage /> },
    { path: '/form', element: <Registration /> },
    { path: '/edit/:id', element: <EditUser /> },
    { path: '/thankyouPage', element: <ThankYouPage /> },
    // {
    //   path: '/',
    //   element: <Navigate to="/login" />,
    // },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      ),
    },
    {
      path: '/menu1',
      element: (
        <PrivateRoute
          path="/menu1"
          element={
            <Layout>
              <Menu1 />
            </Layout>
          }
        />
      ),
    },
    {
      path: '/menu2',
      element: (
        <PrivateRoute
          path="/menu2"
          element={
            <Layout>
              <Menu2 />
            </Layout>
          }
        />
      ),
    },
  ]);

  return routes;
};

export default Router;
