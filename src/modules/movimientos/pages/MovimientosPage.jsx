import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

import MovimientoForm from "../components/MovimientoForm";
import { useMovimientos } from "../hooks/useMovimientos";

export default function MovimientosPage() {
    const { 
        movimientos, 
        isLoadingMovimientos, 
        refetchMovimientos 
    } = useMovimientos();

    // Helper para formatear la fecha de forma legible
    function formatearFecha(fechaISO) {
        if (!fechaISO) return "-";
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Helper para el color del badge según el tipo de movimiento
    function colorPorTipo(tipo) {
        switch (tipo) {
            case "Agregar":           return "success";
            case "Desechar":          return "danger";
            case "Actualizar Stock":  return "warning";
            case "Modificar Datos":   return "info";
            default:                  return "secondary";
        }
    }

    const columnas = [
        {
            key: "fecha_movimiento",
            title: "Fecha",
            render: (row) => formatearFecha(row.fecha_movimiento),
        },
        {
            key: "articulo",
            title: "Artículo",
            render: (row) => (
                <div>
                    <strong>{row.articulos?.codigo || "-"}</strong>
                    <br />
                    <small>{row.articulos?.nombre || "Artículo eliminado"}</small>
                </div>
            ),
        },
        {
            key: "tipo_movimiento",
            title: "Tipo",
            render: (row) => (
                <Badge variant={colorPorTipo(row.tipo_movimiento)}>
                    {row.tipo_movimiento}
                </Badge>
            ),
        },
        {
            key: "cantidad",
            title: "Cantidad",
            render: (row) => (
                row.tipo_movimiento === "Modificar Datos" 
                    ? "—" 
                    : row.cantidad
            ),
        },
        {
            key: "usuario",
            title: "Usuario",
            render: (row) => row.usuarios?.nombre_completo || "Sistema",
        },
        {
            key: "motivo",
            title: "Motivo",
        },
    ];

    return (
        <div className="page-container">

            <h1>Movimientos de Inventario</h1>

            <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
                Todos los cambios en el inventario deben registrarse aquí para mantener la trazabilidad del sistema.
            </p>

            {/* Formulario para registrar un nuevo movimiento */}
            <Card>
                <h3>Registrar Nuevo Movimiento</h3>
                <MovimientoForm onSuccess={refetchMovimientos} />
            </Card>

            {/* Historial de movimientos */}
            <Card>
                <h3>Historial de Movimientos</h3>
                <Table
                    columns={columnas}
                    data={movimientos}
                    loading={isLoadingMovimientos}
                    emptyMessage="Aún no se han registrado movimientos."
                />
            </Card>

        </div>
    );
}