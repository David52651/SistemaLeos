import { NavLink, Outlet } from "react-router-dom";

import { logout } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

import { useState } from "react";


export default function MainLayout() {


  const { perfil } = useAuth();


  const [sidebarOpen,setSidebarOpen] = useState(false);



  const menu = [

    {
      nombre:"Dashboard",
      ruta:"/"
    },

    {
      nombre:"Inventario",
      ruta:"/inventario"
    },

    {
      nombre:"Usuarios",
      ruta:"/usuarios"
    },

    {
      nombre:"Categorías",
      ruta:"/categorias"
    },

    {
      nombre:"Tallas",
      ruta:"/tallas"
    },

    {
      nombre:"Propietarios",
      ruta:"/propietarios"
    },

    {
      nombre:"Danzas",
      ruta:"/danzas"
    }

  ];



  return (

    <div className="app-layout">



      {/* OVERLAY MOBILE */}

      {
        sidebarOpen && (

          <div

            className="sidebar-overlay"

            onClick={() =>
              setSidebarOpen(false)
            }

          />

        )
      }






      {/* SIDEBAR */}


      <aside

        className={
          sidebarOpen
          ?
          "sidebar active"
          :
          "sidebar"
        }

      >


        <div className="sidebar-header">


          <h2>
            SistemaLeos
          </h2>


          <small>
            Gestión Folclórica
          </small>


        </div>




        <nav className="sidebar-menu">


          {
            menu.map(item=>(


              <NavLink


                key={item.ruta}


                to={item.ruta}



                onClick={() =>
                  setSidebarOpen(false)
                }



                className={({isActive})=>

                  isActive

                  ?

                  "menu-item active"

                  :

                  "menu-item"

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

            onClick={()=>setSidebarOpen(true)}

          >

            ☰

          </button>






          {/* TITULO */}


          <div className="navbar-title">


            <h3>
              Panel administrativo
            </h3>


          </div>






          {/* USUARIO */}


          <div className="navbar-user">


            <span>

              {perfil?.nombre_completo}

            </span>





            <button

              className="btn btn-danger"

              onClick={logout}

            >

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