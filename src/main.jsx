import './index.css'

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";


import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import { AuthProvider } from "@/contexts/AuthContext";

import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>

      <AuthProvider>

        <App />

      </AuthProvider>

    </QueryClientProvider>

  </React.StrictMode>
);