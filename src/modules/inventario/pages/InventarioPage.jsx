import { useState } from "react";
import { toast } from "sonner";


import { useInventario } from "../hooks/useInventario";
import { useCatalogosInventario } from "../hooks/useCatalogosInventario";


import ArticuloForm from "../components/ArticuloForm";
import ArticuloModal from "../components/modals/ArticuloModal";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";



import {
  createArticulo,
  updateArticulo,
  activarArticulo,
  desactivarArticulo,
  existeArticulo,
  guardarDanzasArticulo,
} from "../services/inventario.service";



import { generarCodigoArticulo }
from "../utils/generarCodigoArticulo";



import { createCategoria }
from "@/modules/catalogos/categorias/services/categorias.service";


import { createTalla }
from "@/modules/catalogos/tallas/services/tallas.service";


import { createPropietario }
from "@/modules/catalogos/propietarios/services/propietarios.service";


import { createDanza }
from "@/modules/catalogos/danzas/services/danzas.service";





export default function InventarioPage(){



const [
 modalCategoria,
 setModalCategoria
]=useState(false);



const [
 modalTalla,
 setModalTalla
]=useState(false);



const [
 modalPropietario,
 setModalPropietario
]=useState(false);



const [
 modalDanza,
 setModalDanza
]=useState(false);





const {
 data:articulos,
 isLoading,
 refetch

}=useInventario();





const {
 tallas

}=useCatalogosInventario();





const [
 editing,
 setEditing

]=useState(null);

/* ==========================================
   CONFIRMACION DE ACCIONES
========================================== */


const [
 confirmAction,
 setConfirmAction
]=useState(null);





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


/* ==========================================
   ABRIR CONFIRMACION
========================================== */


function abrirConfirmacion(action){

    setConfirmAction(action);

}




/* ==========================================
   CERRAR CONFIRMACION
========================================== */


function cerrarConfirmacion(){

    setConfirmAction(null);

}




/* ==========================================
   EJECUTAR CONFIRMACION
========================================== */


async function ejecutarConfirmacion(){


    if(!confirmAction)
        return;



    try{


        await confirmAction.execute();



        toast.success(
            confirmAction.successMessage
        );



        refetch();



    }catch(error){


        toast.error(
            error.message
        );


    }



    cerrarConfirmacion();


}



if(isLoading){

return (

<p>
Cargando inventario...
</p>

);

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
talla=>talla.id===values.talla_id
);





const codigo =
generarCodigoArticulo(
values.nombre,
tallaSeleccionada?.nombre
);





const {

danzas_ids:_danzas_ids,

...restoValores


}=values;





const payload={

...restoValores,

codigo

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









const columnas = [

  {
    key: "codigo",
    title: "Código",
  },

  {
    key: "nombre",
    title: "Nombre",
  },

  {
    key: "categoria",
    title: "Categoría",

    render: (articulo) => (
      articulo.categorias?.nombre || "-"
    ),
  },

  {
    key: "talla",
    title: "Talla",

    render: (articulo) => (
      articulo.tallas?.nombre || "-"
    ),
  },

  {
    key: "propietario",
    title: "Propietario",

    render: (articulo) => (
      articulo.propietarios?.nombre || "-"
    ),
  },

  {
    key: "stock",
    title: "Stock",
    render: (articulo) => articulo.stock_actual,
  },

  {
    key: "estado",
    title: "Estado",

    render: (articulo) => {

      if (articulo.stock_actual === 0) {

        return (
          <span className="status-inactive">
            Agotado
          </span>
        );

      }

      if (articulo.stock_actual <= articulo.stock_min) {

        return (
          <span className="status-warning">
            Stock Bajo
          </span>
        );

      }

      return (
        <span className="status-active">
          Disponible
        </span>
      );

    },
  },

  {
    key: "acciones",
    title: "Acciones",

    render: (articulo) => (

      <div className="table-actions">

        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditing(articulo)}
        >
          Editar
        </Button>

        {articulo.activo ? (

          <Button
            type="button"
            variant="danger"
            onClick={() =>

    abrirConfirmacion({

        title:"Desactivar artículo",

        message:
        "¿Seguro que deseas desactivar este artículo?",


        execute:()=>


            desactivarArticulo(
                articulo.id
            ),


        successMessage:
        "Artículo desactivado correctamente"


    })

}
          >
            Desactivar
          </Button>

        ) : (

          <Button
            type="button"
            variant="success"
            onClick={() =>

    abrirConfirmacion({

        title:"Activar artículo",

        message:
        "¿Seguro que deseas activar este artículo?",


        execute:()=>


            activarArticulo(
                articulo.id
            ),


        successMessage:
        "Artículo activado correctamente"


    })

}
          >
            Activar
          </Button>

        )}

<ConfirmDialog

    open={
        !!confirmAction
    }


    title={
        confirmAction?.title
    }


    message={
        confirmAction?.message
    }


    onConfirm={
        ejecutarConfirmacion
    }


    onCancel={
        cerrarConfirmacion
    }

/>


      </div>

    ),
  },

];









return(


<div className="inventario-page">



<h1>
Inventario
</h1>





<Card>


<h3>

{
editing
?
"Editar artículo"
:
"Nuevo artículo"
}

</h3>



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



</Card>







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







<Card>


<h3>

Lista de inventario

</h3>




<Table


columns={columnas}


data={articulos || []}


/>



</Card>





</div>


);


}