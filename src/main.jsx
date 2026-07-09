import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/responsive.css";


import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";


import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import { AuthProvider } from "@/contexts/AuthContext";



document.documentElement.setAttribute("data-theme", "dark");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>

      <AuthProvider>

        <App />

      </AuthProvider>

    </QueryClientProvider>

  </React.StrictMode>
);