import React from 'react';
import { createRoot } from "react-dom/client";
import Error from './Error/Error';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './loader.scss'
// import App from './App/App';
// import Register from './Register/Register';
// import Login from './Login/Login';
// import Post from './Post/Post'
// import Service from './Service/Service';
// import Account from './Account/Account';
const LazyApp = React.lazy(() => import('./App/App'));
const LazyReg = React.lazy(() => import('./Register/Register'));
const LazyLog = React.lazy(() => import('./Login/Login'));
const LazyPost = React.lazy(() => import('./Post/Post'));
const LazyService = React.lazy(() => import('./Service/Service'));
const LazyAcc = React.lazy(() => import('./Account/Account'));
const LazyPro = React.lazy(() => import('./Profile/Profile'));

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyApp></LazyApp>
      </React.Suspense>
  },
  {
    path: "/napravi_nalog",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyReg></LazyReg>
      </React.Suspense>
  },
  {
    path: "/prijava",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyLog></LazyLog>
      </React.Suspense>

  },
  {
    path: "/objavi",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyPost></LazyPost>
      </React.Suspense>
  },
  {
    path: "/usluga/:id",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyService></LazyService>
      </React.Suspense >
  },
  {
    path: "/korisnik/:username",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyAcc></LazyAcc>
      </React.Suspense>

  },
  {
    path: "/nalog",
    element:
      <React.Suspense fallback={
        <p id='loader'>Učitavanje...</p>
      }>
        <LazyPro></LazyPro>
      </React.Suspense>
  },
  {
    path: "*",
    element: <Error></Error>
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);