import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/contexts/authHook";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";

vi.mock("@/contexts/authHook", () => ({
  useAuth: vi.fn(),
}));

function renderProtectedRoutes() {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <p>Contenido protegido</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>Inicio de sesión</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderRoleRoutes() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["administrador"]}>
              <p>Contenido administrativo</p>
            </RoleRoute>
          }
        />
        <Route path="/" element={<p>Inicio</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("rutas protegidas", () => {
  it("muestra la carga mientras se resuelve la sesión", () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: true });

    renderProtectedRoutes();

    expect(screen.getByText("Cargando...")).toBeTruthy();
  });

  it("redirige a login cuando no existe una sesión", () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });

    renderProtectedRoutes();

    expect(screen.getByText("Inicio de sesión")).toBeTruthy();
  });

  it("permite el acceso a un usuario autenticado", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "user-1" },
      loading: false,
    });

    renderProtectedRoutes();

    expect(screen.getByText("Contenido protegido")).toBeTruthy();
  });

  it("permite la ruta al rol autorizado", () => {
    vi.mocked(useAuth).mockReturnValue({
      perfil: { rol: "administrador" },
    });

    renderRoleRoutes();

    expect(screen.getByText("Contenido administrativo")).toBeTruthy();
  });

  it("redirige a inicio al rol no autorizado", () => {
    vi.mocked(useAuth).mockReturnValue({
      perfil: { rol: "visitante" },
    });

    renderRoleRoutes();

    expect(screen.getByText("Inicio")).toBeTruthy();
  });
});
