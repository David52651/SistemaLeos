import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";
import Loading from "@/components/ui/Loading";

const DashboardPage = lazy(() => import("@/modules/dashboard/pages/DashboardPage"));
const InventarioPage = lazy(() => import("@/modules/inventario/pages/InventarioPage"));
const LoginPage = lazy(() => import("@/modules/auth/LoginPage"));
const CategoriasPage = lazy(() => import("@/modules/catalogos/categorias/pages/CategoriasPage"));
const TallasPage = lazy(() => import("@/modules/catalogos/tallas/pages/TallasPage"));
const PropietariosPage = lazy(() => import("@/modules/catalogos/propietarios/pages/PropietariosPage"));
const DanzasPage = lazy(() => import("@/modules/catalogos/danzas/pages/DanzasPage"));
const MovimientosPage = lazy(() => import("@/modules/movimientos/pages/MovimientosPage"));
const AlquileresPage = lazy(() => import("@/modules/alquileres/pages/AlquileresPage"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inventario" element={<InventarioPage />} />

            <Route
              path="/alquileres"
              element={
                <RoleRoute allowedRoles={["administrador"]}>
                  <AlquileresPage />
                </RoleRoute>
              }
            />

            <Route
              path="/movimientos"
              element={
                <RoleRoute allowedRoles={["administrador"]}>
                  <MovimientosPage />
                </RoleRoute>
              }
            />

            <Route
              path="/categorias"
              element={
                <RoleRoute allowedRoles={["administrador"]}>
                  <CategoriasPage />
                </RoleRoute>
              }
            />

            <Route
              path="/tallas"
              element={
                <RoleRoute allowedRoles={["administrador"]}>
                  <TallasPage />
                </RoleRoute>
              }
            />

            <Route
              path="/propietarios"
              element={
                <RoleRoute allowedRoles={["administrador"]}>
                  <PropietariosPage />
                </RoleRoute>
              }
            />

            <Route path="/danzas" element={<DanzasPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}