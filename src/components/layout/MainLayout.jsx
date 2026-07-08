import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { logout } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export default function MainLayout() {

  const { perfil } = useAuth();

  return (
    <div>

      <nav>

        <Link to="/">Dashboard</Link>
        {" | "}

        <Link to="/inventario">Inventario</Link>
        {" | "}

        <Link to="/usuarios">Usuarios</Link>
        {" | "}
        <Link to="/categorias">Categorías</Link>
        {" | "}
        <Link to="/tallas">Tallas</Link>
        {" | "}
        <Link to="/propietarios">Propietarios</Link>
        {" | "}
        <Link to="/danzas">Danzas</Link>
        {" | "}
        <span>{perfil?.nombre_completo}</span>
        {" | "}

        <button onClick={logout}>
          Salir
        </button>

      </nav>

      <hr />

      <Outlet />

    </div>
  );
}