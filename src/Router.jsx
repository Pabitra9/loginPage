import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoginPage from "./Components/LoginPage";
import Layout from "./Components/Shared/Layout";
import Menu1 from "./Components/Menu1";
import Menu2 from "./Components/Menu2";
import Registration from "./RegistrationForm/Registration";
import EditUser from "./RegistrationForm/EditUser";
import ThankYouPage from "./Components/ThankYouPage";

const Router = () => {
  const routes = useRoutes([
    { path: '/login', element: <LoginPage /> },
    { path: '/form', element: <Registration /> },
    { path: '/edit/:id', element: <EditUser /> },
    { path: '/thankyouPage', element: <ThankYouPage /> },
    {
      path: '/',
      element: <Navigate to="/login" />,
    },
    {
      path: '/dashboard',
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
