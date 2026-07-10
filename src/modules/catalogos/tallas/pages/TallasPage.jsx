import { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

import { useTallas } from "../hooks/useTallas";

import TallaForm from "../components/TallaForm";

import {
    createTalla,
    updateTalla,
    desactivarTalla,
    activarTalla,
} from "../services/tallas.service";

export default function TallasPage() {

    /* ==========================================
       CONSULTA DE DATOS
    ========================================== */

    const {

        data: tallas,

        isLoading,

        refetch,

    } = useTallas();

    /* ==========================================
       ESTADO DE EDICIÓN
    ========================================== */

    const [

        editing,

        setEditing,

    ] = useState(null);

    if (isLoading) {

        return <p>Cargando tallas...</p>;

    }

    /* ==========================================
       CREAR
    ========================================== */

    async function crearTalla(values) {

        try {

            await createTalla(values);

            toast.success(
                "Talla creada correctamente"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* ==========================================
       EDITAR
    ========================================== */

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

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* ==========================================
       GUARDAR
    ========================================== */

    async function guardarTalla(values) {

        if (editing) {

            await editarTalla(values);

            return;

        }

        await crearTalla(values);

    }

    /* ==========================================
       DESACTIVAR
    ========================================== */

    async function desactivarTallaHandler(id) {

        try {

            const confirmar = window.confirm(
                "¿Deseas desactivar esta talla?"
            );

            if (!confirmar) return;

            await desactivarTalla(id);

            toast.success(
                "Talla desactivada"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* ==========================================
       ACTIVAR
    ========================================== */

    async function activarTallaHandler(id) {

        try {

            await activarTalla(id);

            toast.success(
                "Talla activada"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* ==========================================
       COLUMNAS DE LA TABLA
    ========================================== */

    const columnas = [

        {
            key: "nombre",
            title: "Talla",
        },

        {
            key: "estado",
            title: "Estado",

            render: (talla) => (

                talla.activo

                    ? <span>Activa</span>

                    : <span>Inactiva</span>

            ),

        },

        {
            key: "acciones",
            title: "Acciones",

            render: (talla) => (

                <div className="table-actions">

                    <Button
                        variant="secondary"
                        onClick={() =>
                            setEditing(talla)
                        }
                    >
                        Editar
                    </Button>

                    {

                        talla.activo

                            ?

                            (

                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        desactivarTallaHandler(
                                            talla.id
                                        )
                                    }
                                >
                                    Desactivar
                                </Button>

                            )

                            :

                            (

                                <Button
                                    variant="success"
                                    onClick={() =>
                                        activarTallaHandler(
                                            talla.id
                                        )
                                    }
                                >
                                    Activar
                                </Button>

                            )

                    }

                </div>

            )

        }

    ];

    /* ==========================================
       RENDER
    ========================================== */

    return (

        <div className="page-container">

            <h1>Tallas</h1>

            <Card>

                <h3>

                    {

                        editing

                            ? "Editar talla"

                            : "Nueva talla"

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

        </div>

    );

}