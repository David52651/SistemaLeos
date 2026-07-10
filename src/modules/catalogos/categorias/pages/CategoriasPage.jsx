import { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

import { useCategorias } from "../hooks/useCategorias";
import CategoriaForm from "../components/CategoriaForm";

import {
    createCategoria,
    updateCategoria,
    desactivarCategoria,
    activarCategoria,
} from "../services/categorias.service";

export default function CategoriasPage() {

    const {
        data: categorias,
        isLoading,
        refetch,
    } = useCategorias();

    const [editing, setEditing] = useState(null);

    if (isLoading) {

        return (
            <p>Cargando categorías...</p>
        );

    }

    /* =====================================================
       CREAR
    ===================================================== */

    async function crearCategoria(values) {

        try {

            await createCategoria(values);

            toast.success(
                "Categoría creada correctamente"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* =====================================================
       EDITAR
    ===================================================== */

    async function editarCategoria(values) {

        try {

            await updateCategoria(
                editing.id,
                values
            );

            toast.success(
                "Categoría actualizada correctamente"
            );

            setEditing(null);

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* =====================================================
       GUARDAR
    ===================================================== */

    async function guardarCategoria(values) {

        if (editing) {

            await editarCategoria(values);

            return;

        }

        await crearCategoria(values);

    }

    /* =====================================================
       DESACTIVAR
    ===================================================== */

    async function desactivarCategoriaHandler(id) {

        try {

            const confirmar = window.confirm(
                "¿Deseas desactivar esta categoría?"
            );

            if (!confirmar) return;

            await desactivarCategoria(id);

            toast.success(
                "Categoría desactivada"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* =====================================================
       ACTIVAR
    ===================================================== */

    async function activarCategoriaHandler(id) {

        try {

            await activarCategoria(id);

            toast.success(
                "Categoría activada"
            );

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

    }

    /* =====================================================
       COLUMNAS
    ===================================================== */

    const columnas = [

        {
            key: "nombre",
            title: "Nombre",
        },

        {
            key: "descripcion",
            title: "Descripción",
        },

        {
            key: "estado",
            title: "Estado",

            render: (categoria) => (

                categoria.activo

                    ? <span className="status-active">Activa</span>

                    : <span className="status-inactive">Inactiva</span>

            )

        },

        {
            key: "acciones",
            title: "Acciones",

            render: (categoria) => (

                <div className="table-actions">

                    <Button
                        variant="secondary"
                        onClick={() => setEditing(categoria)}
                    >
                        Editar
                    </Button>

                    {

                        categoria.activo

                            ?

                            <Button
                                variant="danger"
                                onClick={() =>
                                    desactivarCategoriaHandler(
                                        categoria.id
                                    )
                                }
                            >
                                Desactivar
                            </Button>

                            :

                            <Button
                                variant="success"
                                onClick={() =>
                                    activarCategoriaHandler(
                                        categoria.id
                                    )
                                }
                            >
                                Activar
                            </Button>

                    }

                </div>

            )

        }

    ];

    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="page-container">

            <h1>

                Categorías

            </h1>

            <Card>

                <h3>

                    {

                        editing

                            ? "Editar categoría"

                            : "Nueva categoría"

                    }

                </h3>

                <CategoriaForm

                    onSubmit={guardarCategoria}

                    initialValues={editing}

                />

            </Card>

            <Card>

                <h3>

                    Lista de categorías

                </h3>

                <Table

                    columns={columnas}

                    data={categorias || []}

                />

            </Card>

        </div>

    );

}