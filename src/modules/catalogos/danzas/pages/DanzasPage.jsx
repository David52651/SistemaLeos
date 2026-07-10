import { useState } from "react";
import { toast } from "sonner";


import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";


import { useDanzas } from "../hooks/useDanzas";


import DanzaForm from "../components/DanzaForm";


import {
  createDanza,
  updateDanza,
  desactivarDanza,
  activarDanza,
} from "../services/danzas.service";



export default function DanzasPage() {



  const {

    data: danzas,

    isLoading,

    refetch,

  } = useDanzas();




  const [

    editing,

    setEditing

  ] = useState(null);







  if(isLoading){

    return (

      <p>

        Cargando danzas...

      </p>

    );

  }








  async function crearDanza(values){


    try{


      await createDanza(values);



      toast.success(

        "Danza creada correctamente"

      );



      refetch();



    }catch(error){


      toast.error(
        error.message
      );


    }


  }









  async function editarDanza(values){


    try{


      await updateDanza(

        editing.id,

        values

      );



      toast.success(

        "Danza actualizada correctamente"

      );



      setEditing(null);



      refetch();



    }catch(error){


      toast.error(

        error.message

      );


    }


  }









  async function guardarDanza(values){


    if(editing){


      await editarDanza(values);


      return;


    }



    await crearDanza(values);



  }










  async function desactivarDanzaHandler(id){


    const confirmar =

      window.confirm(

        "¿Desactivar danza?"

      );



    if(!confirmar)

      return;





    await desactivarDanza(id);



    toast.success(

      "Danza desactivada"

    );



    refetch();



  }









  async function activarDanzaHandler(id){



    await activarDanza(id);



    toast.success(

      "Danza activada"

    );



    refetch();



  }











 const columnas = [
  {
    key: "nombre",
    title: "Nombre",
  },

  {
    key: "ciudad",
    title: "Ciudad",
  },

  {
    key: "descripcion",
    title: "Descripción",
  },

  {
    key: "estado",
    title: "Estado",
    render: (danza) => (
      <span
        className={
          danza.activo
            ? "status-active"
            : "status-inactive"
        }
      >
        {danza.activo ? "Activa" : "Inactiva"}
      </span>
    ),
  },

  {
    key: "acciones",
    title: "Acciones",
    render: (danza) => (
      <div className="table-actions">

        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditing(danza)}
        >
          Editar
        </Button>

        {danza.activo ? (

          <Button
            type="button"
            variant="danger"
            onClick={() =>
              desactivarDanzaHandler(danza.id)
            }
          >
            Desactivar
          </Button>

        ) : (

          <Button
            type="button"
            variant="success"
            onClick={() =>
              activarDanzaHandler(danza.id)
            }
          >
            Activar
          </Button>

        )}

      </div>
    ),
  },
];









  return (


    <div className="page-container">


      <h1>

        Danzas

      </h1>





      <Card>


        <h3>

          {

          editing

          ?

          "Editar danza"

          :

          "Nueva danza"

          }


        </h3>





        <DanzaForm

          onSubmit={guardarDanza}

          initialValues={editing}

        />



      </Card>







      <Card>


        <h3>

          Lista de danzas

        </h3>



        <Table

          columns={columnas}

          data={danzas || []}

        />


      </Card>




    </div>


  );


}