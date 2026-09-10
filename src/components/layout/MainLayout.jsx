import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

import { logout } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";


export default function MainLayout() {

  const { perfil } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Definimos el menú con los roles permitidos
  const menuCompleto = [
    {
      nombre: "Dashboard",
      ruta: "/",
      roles: ["administrador", "visitante"],
    },
    {
      nombre: "Inventario",
      ruta: "/inventario",
      roles: ["administrador", "visitante"],
    },
    {
      nombre: "Movimientos",         
      ruta: "/movimientos",          
      roles: ["administrador"],      
    },
    {
      nombre: "Usuarios",
      ruta: "/usuarios",
      roles: ["administrador"],
    },
    {
      nombre: "Categorías",
      ruta: "/categorias",
      roles: ["administrador"],
    },
    {
      nombre: "Tallas",
      ruta: "/tallas",
      roles: ["administrador"],
    },
    {
      nombre: "Propietarios",
      ruta: "/propietarios",
      roles: ["administrador"],
    },
    {
      nombre: "Danzas",
      ruta: "/danzas",
      roles: ["administrador", "visitante"],
    },
  ];

  // Filtramos el menú según el rol del perfil
  const menu = menuCompleto.filter((item) =>
    item.roles.includes(perfil?.rol)
  );



  return (

    <div className="app-layout">

      {/* OVERLAY MOBILE */}
      {
        sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )
      }

      {/* SIDEBAR */}
      <aside className={sidebarOpen ? "sidebar active" : "sidebar"}>

        <div className="sidebar-header">
          <h2>SistemaLeos</h2>
          <small>Gestión Folclórica</small>
        </div>

        <nav className="sidebar-menu">
          {
            menu.map((item) => (
              <NavLink
                key={item.ruta}
                to={item.ruta}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                {item.nombre}
              </NavLink>
            ))
          }
        </nav>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">

        {/* NAVBAR */}
        <header className="navbar">

          {/* BOTON MOBILE */}
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {/* TITULO */}
          <div className="navbar-title">
            <h3>Panel administrativo</h3>
          </div>

          {/* USUARIO */}
          <div className="navbar-user">
            <span>{perfil?.nombre_completo}</span>
            <button className="btn btn-danger" onClick={logout}>
              Salir
            </button>
          </div>

        </header>

        {/* CONTENIDO DE PAGINAS */}
        <section className="page-container">
          <Outlet />
        </section>

      </main>

    </div>

  );

}