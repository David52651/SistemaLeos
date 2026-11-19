import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import MovimientoForm from "../components/MovimientoForm";
import { useMovimientos } from "../hooks/useMovimientos";

import { exportToCSV } from "@/utils/exportToCSV";

export default function MovimientosPage() {
  const { movimientos, isLoadingMovimientos, refetchMovimientos } =
    useMovimientos();

  //ESTADOS PARA EL FILTRO
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");

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

  // Helper para el color del badge
  function colorPorTipo(tipo) {
    switch (tipo) {
      case "Agregar":
        return "success";
      case "Desechar":
        return "danger";
      case "Actualizar Stock":
        return "warning";
      case "Modificar Datos":
        return "info";
      case "Alquiler":
        return "warning";
      case "Devolución":
        return "success";
      default:
        return "secondary";
    }
  }

  //Aplicar filtros de fecha (Mes y Año)
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((mov) => {
      const fecha = new Date(mov.fecha_movimiento);

      // Filtro por Mes (0 a 11)
      if (filtroMes !== "" && fecha.getMonth().toString() !== filtroMes) {
        return false;
      }
      // Filtro por Año
      if (filtroAnio !== "" && fecha.getFullYear().toString() !== filtroAnio) {
        return false;
      }
      return true;
    });
  }, [movimientos, filtroMes, filtroAnio]);

  //Generar opciones de años disponibles
  const aniosDisponibles = useMemo(() => {
    const anios = new Set(
      movimientos.map((m) => new Date(m.fecha_movimiento).getFullYear()),
    );
    return Array.from(anios).sort((a, b) => b - a); // Orden descendente
  }, [movimientos]);

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
      key: "movimiento",
      title: "Movimiento",
      render: (row) => row.movimiento || row.tipo_movimiento,
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
        Todos los cambios en el inventario deben registrarse aquí para mantener
        la trazabilidad del sistema.
      </p>

      {/* Formulario para registrar un nuevo movimiento */}
      <Card>
        <h3>Registrar Nuevo Movimiento</h3>
        <MovimientoForm onSuccess={refetchMovimientos} />
      </Card>

      {/* Historial de movimientos */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Historial de Movimientos</h3>

          {/* Botón para exportar a CSV */}
          <Button
            variant="success"
            onClick={() =>
              exportToCSV(
                movimientosFiltrados,
                columnas,
                "historial_movimientos",
              )
            }
            style={{ height: "38px", padding: "0 16px" }}
          >
            Exportar a CSV
          </Button>
        </div>

        {/* Filtros por Mes y Año */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "150px" }}>
            <Select
              label="Filtrar por Mes"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
            >
              <option value="">Todos los meses</option>
              <option value="0">Enero</option>
              <option value="1">Febrero</option>
              <option value="2">Marzo</option>
              <option value="3">Abril</option>
              <option value="4">Mayo</option>
              <option value="5">Junio</option>
              <option value="6">Julio</option>
              <option value="7">Agosto</option>
              <option value="8">Septiembre</option>
              <option value="9">Octubre</option>
              <option value="10">Noviembre</option>
              <option value="11">Diciembre</option>
            </Select>
          </div>

          <div style={{ flex: 1, minWidth: "150px" }}>
            <Select
              label="Filtrar por Año"
              value={filtroAnio}
              onChange={(e) => setFiltroAnio(e.target.value)}
            >
              <option value="">Todos los años</option>
              {aniosDisponibles.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setFiltroMes("");
              setFiltroAnio("");
            }}
          >
            Limpiar Filtros
          </Button>
        </div>

        <Table
          columns={columnas}
          data={movimientosFiltrados}
          loading={isLoadingMovimientos}
          emptyMessage="No se encontraron movimientos con esos filtros."
        />
      </Card>
    </div>
  );
}
