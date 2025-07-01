import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./pages/UserContext";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);