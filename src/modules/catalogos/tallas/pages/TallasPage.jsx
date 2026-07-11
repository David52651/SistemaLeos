import { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { useTallas } from "../hooks/useTallas";

import TallaForm from "../components/TallaForm";

import {
    createTalla,
    updateTalla,
    desactivarTalla,
    activarTalla,
} from "../services/tallas.service";


export default function TallasPage() {


    const {

        data: tallas,

        isLoading,

        refetch,

    } = useTallas();




    const [

        editing,

        setEditing,

    ] = useState(null);



    /*
        CONTROL DEL DIALOGO
    */

    const [

        confirmOpen,

        setConfirmOpen

    ] = useState(false);



    const [

        tallaSeleccionada,

        setTallaSeleccionada

    ] = useState(null);






    if (isLoading) {

        return (

            <p>
                Cargando tallas...
            </p>

        );

    }







    async function crearTalla(values) {


        try {


            await createTalla(values);



            toast.success(
                "Talla creada correctamente"
            );



            refetch();



        } catch(error){


            toast.error(
                error.message
            );


        }


    }









    async function editarTalla(values) {


        try {


            await updateTalla(

                editing.id,

                values

            );



            toast.success(
                "Talla actualizada correctamente"
            );



            setEditing(null);



            refetch();



        }catch(error){


            toast.error(
                error.message
            );


        }


    }










    async function guardarTalla(values){


        if(editing){


            await editarTalla(values);


            return;


        }



        await crearTalla(values);


    }









    function abrirConfirmacion(talla){


        setTallaSeleccionada(talla);

        setConfirmOpen(true);


    }









    async function confirmarDesactivar(){



        try {



            await desactivarTalla(

                tallaSeleccionada.id

            );



            toast.success(
                "Talla desactivada"
            );



            setConfirmOpen(false);

            setTallaSeleccionada(null);



            refetch();



        }catch(error){


            toast.error(
                error.message
            );


        }


    }









    async function activarTallaHandler(id){



        try {



            await activarTalla(id);



            toast.success(
                "Talla activada"
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

            key:"nombre",

            title:"Talla",

        },



        {

            key:"estado",

            title:"Estado",


            render:(talla)=>(


                talla.activo

                ?

                (

                    <span className="status-active">

                        Activa

                    </span>

                )


                :


                (

                    <span className="status-inactive">

                        Inactiva

                    </span>

                )


            )


        },



        {


            key:"acciones",

            title:"Acciones",


            render:(talla)=>(



                <div className="table-actions">



                    <Button

                        variant="secondary"

                        onClick={()=>setEditing(talla)}

                    >

                        Editar

                    </Button>





                    {


                        talla.activo


                        ?


                        (

                            <Button

                                variant="danger"

                                onClick={()=>abrirConfirmacion(talla)}

                            >

                                Desactivar

                            </Button>

                        )


                        :


                        (

                            <Button

                                variant="success"

                                onClick={()=>activarTallaHandler(talla.id)}

                            >

                                Activar

                            </Button>


                        )


                    }



                </div>


            )


        }


    ];









    return (



        <div className="page-container">



            <h1>

                Tallas

            </h1>





            <Card>


                <h3>


                    {


                        editing

                        ?

                        "Editar talla"

                        :

                        "Nueva talla"


                    }


                </h3>





                <TallaForm


                    onSubmit={guardarTalla}


                    initialValues={editing}


                />



            </Card>









            <Card>



                <h3>

                    Lista de tallas

                </h3>





                <Table


                    columns={columnas}


                    data={tallas || []}


                />



            </Card>








            <ConfirmDialog


                open={confirmOpen}


                title="Desactivar talla"


                message={
                    `¿Seguro que deseas desactivar la talla "${tallaSeleccionada?.nombre}"?`
                }


                confirmText="Desactivar"


                cancelText="Cancelar"


                onCancel={()=>{

                    setConfirmOpen(false);

                    setTallaSeleccionada(null);

                }}


                onConfirm={confirmarDesactivar}


            />




        </div>



    );


}