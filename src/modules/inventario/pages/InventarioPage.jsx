import { useState } from "react";
import { toast } from "sonner";

import { useInventario } from "../hooks/useInventario";
import { useCatalogosInventario } from "../hooks/useCatalogosInventario";

import ArticuloForm from "../components/ArticuloForm";
import ArticuloModal from "../components/modals/ArticuloModal";


import {
  createArticulo,
  updateArticulo,
  activarArticulo,
  desactivarArticulo,
  existeArticulo,
  guardarDanzasArticulo,
} from "../services/inventario.service";


import { generarCodigoArticulo } from "../utils/generarCodigoArticulo";


import { createCategoria } 
from "@/modules/catalogos/categorias/services/categorias.service";


import { createTalla }
from "@/modules/catalogos/tallas/services/tallas.service";


import { createPropietario }
from "@/modules/catalogos/propietarios/services/propietarios.service";


import { createDanza }
from "@/modules/catalogos/danzas/services/danzas.service";



export default function InventarioPage() {


  const [
    modalCategoria,
    setModalCategoria
  ] = useState(false);



  const [
    modalTalla,
    setModalTalla
  ] = useState(false);



  const [
    modalPropietario,
    setModalPropietario
  ] = useState(false);



  const [
    modalDanza,
    setModalDanza
  ] = useState(false);



  const {
    data: articulos,
    isLoading,
    refetch,

  } = useInventario();



  const {
    tallas,

  } = useCatalogosInventario();



  const [
    editing,
    setEditing
  ] = useState(null);





  async function crearCategoria(values){

    try{

      await createCategoria(values);

      toast.success(
        "Categoría creada correctamente"
      );

      setModalCategoria(false);

      refetch();


    }catch(error){

      toast.error(error.message);

    }

  }


  async function crearTalla(values){

    try{

      await createTalla(values);

      toast.success(
        "Talla creada correctamente"
      );


      setModalTalla(false);

      refetch();


    }catch(error){

      toast.error(error.message);

    }

  }


  async function crearPropietario(values){

    try{

      await createPropietario(values);


      toast.success(
        "Propietario creado correctamente"
      );


      setModalPropietario(false);

      refetch();



    }catch(error){

      toast.error(error.message);

    }

  }

  async function crearDanza(values){

    try{

      await createDanza(values);


      toast.success(
        "Danza creada correctamente"
      );


      setModalDanza(false);


      refetch();


    }catch(error){

      toast.error(error.message);

    }

  }


  if(isLoading){

    return <p>Cargando inventario...</p>;

  }


  async function guardarArticulo(values){


    try{


      if(!editing){


        const duplicado =
          await existeArticulo(values);



        if(duplicado){

          toast.error(
            "Ya existe un artículo con esas características"
          );


          return;

        }


      }


      const tallaSeleccionada =
        tallas.data?.find(
          talla =>
          talla.id === values.talla_id
        );


      const codigo =
        generarCodigoArticulo(
          values.nombre,
          tallaSeleccionada?.nombre
        );

      const {

        danzas_ids:_danzas_ids,

        ...restoValores


      } = values;


      const payload={

        ...restoValores,

        codigo,

      };







      let articuloGuardado;





      if(editing){


        await updateArticulo(
          editing.id,
          payload
        );


        await guardarDanzasArticulo(

          editing.id,

          values.danzas_ids || []

        );



        setEditing(null);



      }else{



        articuloGuardado =
          await createArticulo(payload);



        await guardarDanzasArticulo(

          articuloGuardado.id,

          values.danzas_ids || []

        );


      }

      toast.success(
        "Artículo guardado correctamente"
      );


      refetch();




    }catch(error){


      toast.error(
        error.message
      );


    }


  }




  return (

    <div className="inventario-page">


      <h1>
        Inventario
      </h1>

      <ArticuloForm

        onSubmit={guardarArticulo}

        initialValues={editing}

        onOpenCategoria={
          ()=>setModalCategoria(true)
        }

        onOpenTalla={
          ()=>setModalTalla(true)
        }

        onOpenPropietario={
          ()=>setModalPropietario(true)
        }

        onOpenDanza={
          ()=>setModalDanza(true)
        }

      />

      <ArticuloModal

        modalCategoria={modalCategoria}

        setModalCategoria={setModalCategoria}


        modalTalla={modalTalla}

        setModalTalla={setModalTalla}


        modalPropietario={modalPropietario}

        setModalPropietario={setModalPropietario}


        modalDanza={modalDanza}

        setModalDanza={setModalDanza}


        crearCategoria={crearCategoria}

        crearTalla={crearTalla}

        crearPropietario={crearPropietario}

        crearDanza={crearDanza}

      />

      <hr />

      <table>


        <thead>

          <tr>

            <th>Código</th>

            <th>Nombre</th>

            <th>Categoría</th>

            <th>Talla</th>

            <th>Propietario</th>

            <th>Stock</th>

            <th>Estado</th>

            <th>Acciones</th>


          </tr>


        </thead>





        <tbody>


        {
          articulos?.map(
            articulo=>(


              <tr key={articulo.id}>


                <td>
                  {articulo.codigo}
                </td>


                <td>
                  {articulo.nombre}
                </td>


                <td>
                  {articulo.categorias?.nombre}
                </td>


                <td>
                  {articulo.tallas?.nombre}
                </td>


                <td>
                  {articulo.propietarios?.nombre}
                </td>


                <td>
                  {articulo.stock_actual}
                </td>


                <td>

                {
                  articulo.stock_actual===0

                  ?

                  "Agotado"

                  :

                  articulo.stock_actual <= articulo.stock_min

                  ?

                  "Stock Bajo"

                  :

                  "Disponible"

                }


                </td>




                <td>


                  <button
                    onClick={()=>
                      setEditing(articulo)
                    }
                  >

                    Editar

                  </button>





                  {
                    articulo.activo

                    ?

                    <button

                    onClick={async()=>{

                      await desactivarArticulo(
                        articulo.id
                      );

                      refetch();

                    }}

                    >

                    Desactivar

                    </button>


                    :

                    <button

                    onClick={async()=>{

                      await activarArticulo(
                        articulo.id
                      );

                      refetch();

                    }}
                    >
                    Activar
                    </button>

                  }

                </td>

              </tr>
            )
          )
        }
        </tbody>
      </table>
    </div>
  );
}