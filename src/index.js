import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './page/NotFound';
import Products from './page/Products';
import ProductDetail from './page/ProductDetail';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "products",
        element: <Products />
      },
      {
        path: "products/:productId",
        element: <ProductDetail />
      }
    ]
  }
])

root.render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
