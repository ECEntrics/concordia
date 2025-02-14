import React, { Fragment, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';
import RegisterLayout from './layouts/RegisterLayout';

const routesConfig = [
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/home" />,
  },
  {
    exact: true,
    path: '/404',
    layout: MainLayout,
    component: lazy(() => import('./components/NotFound')),
  },
  {
    path: '/auth',
    layout: RegisterLayout,
    routes: [
      {
        exact: true,
        path: '/auth/register',
        component: lazy(() => import('./views/Register')),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/home',
        component: lazy(() => import('./views/Home')),
      },
      {
        exact: true,
        path: '/about',
        component: lazy(() => import('./views/About')),
      },
      {
        exact: true,
        path: '/topics/:id(\\bnew\\b|\\d+)',
        component: lazy(() => import('./views/Topic')),
      },
      {
        exact: true,
        path: ['/users/:id', '/profiles/:id', '/profile'],
        component: lazy(() => import('./views/Profile')),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

const renderRoutes = (routes) => (routes ? (
    <Suspense fallback={<LoadingScreen />}>
        <Switch>
            {routes.map((route, i) => {
              const Layout = route.layout || Fragment;
              const Component = route.component;

              const key = route.path ? route.path.concat(i) : ''.concat(i);
              return (
                  <Route
                    key={key}
                    path={route.path}
                    exact={route.exact}
                    render={(props) => (
                        <Layout>
                            {route.routes
                              ? renderRoutes(route.routes)
                              : <Component {...props} />}
                        </Layout>
                    )}
                  />
              );
            })}
        </Switch>
    </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
