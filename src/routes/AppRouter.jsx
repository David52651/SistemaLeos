import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";

import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import InventarioPage from "@/modules/inventario/pages/InventarioPage";
import UsuariosPage from "@/modules/usuarios/pages/UsuariosPage";
import LoginPage from "@/modules/auth/LoginPage";


import CategoriasPage from "@/modules/catalogos/categorias/pages/CategoriasPage";
import TallasPage from "@/modules/catalogos/tallas/pages/TallasPage";
import PropietariosPage from "@/modules/catalogos/propietarios/pages/PropietariosPage";
import DanzasPage from "@/modules/catalogos/danzas/pages/DanzasPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";


export default function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/inventario"
            element={<InventarioPage />}
          />
          <Route
  path="/categorias"
  element={
    <RoleRoute
      allowedRoles={["administrador"]}
    >
      <CategoriasPage />
    </RoleRoute>
  }
/>
<Route
  path="/tallas"
  element={
    <RoleRoute
      allowedRoles={[
        "administrador",
      ]}
    >
      <TallasPage />
    </RoleRoute>
  }
/>
<Route
  path="/propietarios"
  element={
    <RoleRoute
      allowedRoles={["administrador"]}
    >
      <PropietariosPage />
    </RoleRoute>
  }
/>

<Route
  path="/danzas"
  element={<DanzasPage />}
/>

<Route
  path="/usuarios"
  element={
    <RoleRoute
      allowedRoles={["administrador"]}
    >
      <UsuariosPage />
    </RoleRoute>
  }
/>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}