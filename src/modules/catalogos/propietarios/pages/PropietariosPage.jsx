import { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

import { usePropietarios } from "../hooks/usePropietarios";

import PropietarioForm from "../components/PropietarioForm";

import {
    createPropietario,
    updatePropietario,
    desactivarPropietario,
    activarPropietario,
} from "../services/propietarios.service";

export default function PropietariosPage() {

    const {

        data: propietarios,

        isLoading,

        refetch,

    } = usePropietarios();

    const [

        editing,

        setEditing

    ] = useState(null);

    if (isLoading) {

        return (

            <p>

                Cargando propietarios...

            </p>

        );

    }

    async function crearPropietario(values) {

        try {

            await createPropietario(values);

            toast.success(
                "Propietario creado correctamente"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    async function editarPropietario(values) {

        try {

            await updatePropietario(
                editing.id,
                values
            );

            toast.success(
                "Propietario actualizado correctamente"
            );

            setEditing(null);

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    async function desactivarPropietarioHandler(id) {

        try {

            const confirmar = window.confirm(
                "¿Deseas desactivar este propietario?"
            );

            if (!confirmar) return;

            await desactivarPropietario(id);

            toast.success(
                "Propietario desactivado"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    async function activarPropietarioHandler(id) {

        try {

            await activarPropietario(id);

            toast.success(
                "Propietario activado"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    async function guardarPropietario(values) {

        if (editing) {

            await editarPropietario(values);

            return;

        }

        await crearPropietario(values);

    }

    const columnas = [

        {

            key: "nombre",

            title: "Nombre",

        },

        {

            key: "tipo",

            title: "Tipo",

        },

        {

            key: "telefono",

            title: "Teléfono",

        },

        {

            key: "correo",

            title: "Correo",

        },

        {

            key: "estado",

            title: "Estado",

            render: (propietario) => (

                propietario.activo

                    ? <span>Activo</span>

                    : <span>Inactivo</span>

            ),

        },

        {

            key: "acciones",

            title: "Acciones",

            render: (propietario) => (

                <div className="table-actions">

                    <Button

                        variant="secondary"

                        onClick={() =>
                            setEditing(propietario)
                        }

                    >

                        Editar

                    </Button>

                    {

                        propietario.activo

                            ?

                            (

                                <Button

                                    variant="danger"

                                    onClick={() =>
                                        desactivarPropietarioHandler(
                                            propietario.id
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
                                        activarPropietarioHandler(
                                            propietario.id
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

    return (

        <div className="page-container">

            <h1>

                Propietarios

            </h1>

            <Card>

                <h3>

                    {

                        editing

                            ?

                            "Editar propietario"

                            :

                            "Nuevo propietario"

                    }

                </h3>

                <PropietarioForm

                    onSubmit={guardarPropietario}

                    initialValues={editing}

                />

            </Card>

            <Card>

                <h3>

                    Lista de propietarios

                </h3>

                <Table

                    columns={columnas}

                    data={propietarios || []}

                />

            </Card>

        </div>

    );

}