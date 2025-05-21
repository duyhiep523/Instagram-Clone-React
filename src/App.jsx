import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    // <BrowserRouter>
    <Router>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={2}
      />
    </Router>
    // </BrowserRouter>
  );
}

export default App;
