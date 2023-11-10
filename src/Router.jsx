import React from "react";
import { useRoutes } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoginPage from "./Components/LoginPage";
import Layout from "./Components/Shared/Layout";
import Menu1 from "./Components/Menu1";
import Menu2 from "./Components/Menu2";
import LogOutPage from "./LogOutPage";
import Registration from "./RegistrationForm/Registration";
import EditUser from "./RegistrationForm/EditUser";
import ThankYouPage from "./Components/ThankYouPage";
const Router= () => {
    const routes = useRoutes([
        { path: '/login', element: <LoginPage /> },
        { path: '/logout', element: <LogOutPage /> },
        { path: '/form', element: <Registration /> },
        { path: '/edit/:id', element: <EditUser/> },
        { path: '/thankyouPage', element: <ThankYouPage/> },
        {
          path: '/',
          element: (
            <Layout>
              <Dashboard />
            </Layout>
          ),
        },
        {
          path: '/menu1',
          element: (
            <Layout>
              <Menu1 />
            </Layout>
          ),
        },
        {
          path: '/menu2',
          element: (
            <Layout>
              <Menu2 />
            </Layout>
          ),
        },
      ]);
    
      return routes;
    };
    
    export default Router;