import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authHook";

export default function RoleRoute({
  children,
  allowedRoles,
}) {

  const { perfil } = useAuth();

  if (!perfil) {
    return <p>Cargando...</p>;
  }

  if (!allowedRoles.includes(perfil.rol)) {
    return <Navigate to="/" />;
  }

  return children;
}