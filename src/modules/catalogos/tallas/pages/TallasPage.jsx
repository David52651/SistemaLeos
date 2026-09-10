import { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { useTallas } from "../hooks/useTallas";

import {
    desactivarTalla,
    activarTalla,
} from "../services/tallas.service";


export default function TallasPage() {

    const {
        data: tallas,
        isLoading,
        refetch,
    } = useTallas();

    /* =====================================================
       CONFIRMACION DE ACCIONES
    ===================================================== */

    const [
        confirmAction,
        setConfirmAction
    ] = useState(null);


    function abrirConfirmacion(action) {
        setConfirmAction(action);
    }


    function cerrarConfirmacion() {
        setConfirmAction(null);
    }


    async function ejecutarConfirmacion() {

        if (!confirmAction) return;

        try {

            await confirmAction.execute();

            toast.success(confirmAction.successMessage);

            refetch();

        } catch (error) {

            toast.error(error.message);

        }

        cerrarConfirmacion();

    }


    if (isLoading) {
        return <p>Cargando tallas...</p>;
    }


    /* =====================================================
       DESACTIVAR / ACTIVAR
    ===================================================== */

    function desactivarTallaHandler(talla) {

        abrirConfirmacion({
            title: "Desactivar talla",
            message: `¿Seguro que deseas desactivar la talla "${talla.nombre}"?`,
            execute: () => desactivarTalla(talla.id),
            successMessage: "Talla desactivada correctamente",
        });

    }


    function activarTallaHandler(talla) {

        abrirConfirmacion({
            title: "Activar talla",
            message: `¿Seguro que deseas activar la talla "${talla.nombre}"?`,
            execute: () => activarTalla(talla.id),
            successMessage: "Talla activada correctamente",
        });

    }


    /* =====================================================
       COLUMNAS
    ===================================================== */

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
                    ? <span className="status-active">Activa</span>
                    : <span className="status-inactive">Inactiva</span>
            ),
        },

        {
            key: "acciones",
            title: "Acciones",
            render: (talla) => (
                <div className="table-actions">

                    {talla.activo ? (
                        <Button
                            variant="danger"
                            onClick={() => desactivarTallaHandler(talla)}
                        >
                            Desactivar
                        </Button>
                    ) : (
                        <Button
                            variant="success"
                            onClick={() => activarTallaHandler(talla)}
                        >
                            Activar
                        </Button>
                    )}

                </div>
            ),
        },

    ];


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="page-container">

            <h1>Tallas</h1>

            <p style={{ marginBottom: "1rem", opacity: 0.75 }}>
                Para crear o modificar tallas, ve al módulo de <strong>Movimientos</strong> y usa
                el botón <strong>"+ Nueva talla"</strong> dentro del formulario de nuevo artículo.
                Aquí solo puedes activar o desactivar registros.
            </p>

            <Card>

                <h3>Lista de tallas</h3>

                <Table
                    columns={columnas}
                    data={tallas || []}
                />

            </Card>

            <ConfirmDialog
                open={!!confirmAction}
                title={confirmAction?.title}
                message={confirmAction?.message}
                onConfirm={ejecutarConfirmacion}
                onCancel={cerrarConfirmacion}
            />

        </div>

    );

}