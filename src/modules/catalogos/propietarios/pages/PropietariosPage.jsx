import { useState } from "react";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { usePropietarios } from "../hooks/usePropietarios";

import PropietarioDetalle from "../components/PropietarioDetalle";

import {
    desactivarPropietario,
    activarPropietario,
} from "../services/propietarios.service";


export default function PropietariosPage() {

    /* =====================================================
       HOOKS (siempre al inicio, sin condiciones)
    ===================================================== */

    const {
        data: propietarios,
        isLoading,
        refetch,
    } = usePropietarios();

    const [
        confirmAction,
        setConfirmAction
    ] = useState(null);

    // ⬅️ MOVIDO ARRIBA: estado del modal de detalle
    const [
        propietarioDetalle,
        setPropietarioDetalle
    ] = useState(null);


    /* =====================================================
       FUNCIONES (no son hooks, van después)
    ===================================================== */

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


    function desactivarPropietarioHandler(id) {

        abrirConfirmacion({
            title: "Desactivar propietario",
            message: "¿Seguro que deseas desactivar este propietario?",
            execute: () => desactivarPropietario(id),
            successMessage: "Propietario desactivado correctamente",
        });

    }


    function activarPropietarioHandler(id) {

        abrirConfirmacion({
            title: "Activar propietario",
            message: "¿Seguro que deseas activar este propietario?",
            execute: () => activarPropietario(id),
            successMessage: "Propietario activado correctamente",
        });

    }


    /* =====================================================
       EARLY RETURN (después de TODOS los hooks)
    ===================================================== */

    if (isLoading) {
        return <p>Cargando propietarios...</p>;
    }


    /* =====================================================
       COLUMNAS
    ===================================================== */

    const columnas = [

        { key: "nombre", title: "Nombre" },

        { key: "tipo", title: "Tipo" },

        { key: "telefono", title: "Teléfono" },

        { key: "correo", title: "Correo" },

        {
            key: "estado",
            title: "Estado",
            render: (propietario) => (
                <span
                    className={
                        propietario.activo
                            ? "status-active"
                            : "status-inactive"
                    }
                >
                    {propietario.activo ? "Activo" : "Inactivo"}
                </span>
            ),
        },

        {
            key: "acciones",
            title: "Acciones",
            render: (propietario) => (
                <div
                    className="table-actions"
                    onClick={(e) => e.stopPropagation()}
                >

                    {propietario.activo ? (
                        <Button
                            variant="danger"
                            onClick={() =>
                                desactivarPropietarioHandler(propietario.id)
                            }
                        >
                            Desactivar
                        </Button>
                    ) : (
                        <Button
                            variant="success"
                            onClick={() =>
                                activarPropietarioHandler(propietario.id)
                            }
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

            <h1>Propietarios</h1>

            <p style={{ marginBottom: "1rem", opacity: 0.75 }}>
                Haz clic en cualquier fila para ver el detalle del propietario.
                Para crear o modificar propietarios, ve al módulo de <strong>Movimientos</strong>.
                Aquí solo puedes activar o desactivar registros.
            </p>

            <Card>

                <h3>Lista de propietarios</h3>

                <Table
                    columns={columnas}
                    data={propietarios || []}
                    onRowClick={(prop) => setPropietarioDetalle(prop)}
                />

            </Card>

            <ConfirmDialog
                open={!!confirmAction}
                title={confirmAction?.title}
                message={confirmAction?.message}
                onConfirm={ejecutarConfirmacion}
                onCancel={cerrarConfirmacion}
            />

            <PropietarioDetalle
                open={!!propietarioDetalle}
                propietario={propietarioDetalle}
                onClose={() => setPropietarioDetalle(null)}
            />

        </div>

    );

}