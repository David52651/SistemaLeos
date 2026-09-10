import { useState, useMemo } from "react";
import { toast } from "sonner";

import { useInventario } from "../hooks/useInventario";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";

import InventarioFilters from "../components/InventarioFilters";
import ArticuloDetalle from "../components/ArticuloDetalle"; 

import {
  activarArticulo,
  desactivarArticulo,
} from "../services/inventario.service";


export default function InventarioPage() {

  const {
    data: articulos,
    isLoading,
    refetch,
  } = useInventario();

  /* ==========================================
     ESTADOS DE FILTROS
  ========================================== */

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTalla, setFiltroTalla] = useState("");
  const [filtroPropietario, setFiltroPropietario] = useState("");
  const [articuloDetalle, setArticuloDetalle] = useState(null);


  /* ==========================================
     APLICAR FILTROS
  ========================================== */

  const articulosFiltrados = useMemo(() => {

    if (!articulos) return [];

    const texto = busqueda.toLowerCase().trim();

    return articulos.filter((art) => {

      const coincideBusqueda =
        !texto ||
        art.codigo?.toLowerCase().includes(texto) ||
        art.nombre?.toLowerCase().includes(texto) ||
        art.propietarios?.nombre?.toLowerCase().includes(texto);

      const coincideCategoria =
        !filtroCategoria || art.categoria_id === filtroCategoria;

      const coincideTalla =
        !filtroTalla || art.talla_id === filtroTalla;

      const coincidePropietario =
        !filtroPropietario || art.propietario_id === filtroPropietario;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideTalla &&
        coincidePropietario
      );

    });

  }, [articulos, busqueda, filtroCategoria, filtroTalla, filtroPropietario]);


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroCategoria("");
    setFiltroTalla("");
    setFiltroPropietario("");
  }


  /* ==========================================
     CONFIRMACION DE ACCIONES
  ========================================== */

  const [confirmAction, setConfirmAction] = useState(null);

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
    return <p>Cargando inventario...</p>;
  }


  /* ==========================================
     COLUMNAS
  ========================================== */

  const columnas = [

    { key: "codigo", title: "Código" },
    { key: "nombre", title: "Nombre" },

    {
      key: "categoria",
      title: "Categoría",
      render: (articulo) => articulo.categorias?.nombre || "-",
    },

    {
      key: "talla",
      title: "Talla",
      render: (articulo) => articulo.tallas?.nombre || "-",
    },

    {
      key: "propietario",
      title: "Propietario",
      render: (articulo) => articulo.propietarios?.nombre || "-",
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
          return <span className="status-inactive">Agotado</span>;
        }
        if (articulo.stock_actual <= articulo.stock_min) {
          return <span className="status-warning">Stock Bajo</span>;
        }
        return <span className="status-active">Disponible</span>;
      },
    },

    {
      key: "acciones",
      title: "Acciones",
      render: (articulo) => (

        <div
          className="table-actions"
          onClick={(e) => e.stopPropagation()}
        >

          {articulo.activo ? (
            <Button
              type="button"
              variant="danger"
              onClick={() =>
                abrirConfirmacion({
                  title: "Desactivar artículo",
                  message: "¿Seguro que deseas desactivar este artículo?",
                  execute: () => desactivarArticulo(articulo.id),
                  successMessage: "Artículo desactivado correctamente",
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
                  title: "Activar artículo",
                  message: "¿Seguro que deseas activar este artículo?",
                  execute: () => activarArticulo(articulo.id),
                  successMessage: "Artículo activado correctamente",
                })
              }
            >
              Activar
            </Button>
          )}

        </div>
      ),
    },

  ];


  /* ==========================================
     RENDER
  ========================================== */

  return (

    <div className="inventario-page">

      <h1>Inventario</h1>

      <p style={{ marginBottom: "1rem", opacity: 0.75 }}>
        Haz clic en cualquier fila para ver el detalle del artículo.
        Para crear o modificar artículos, ve al módulo de <strong>Movimientos</strong>.
      </p>

      <Card>

        <InventarioFilters
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          filtroTalla={filtroTalla}
          setFiltroTalla={setFiltroTalla}
          filtroPropietario={filtroPropietario}
          setFiltroPropietario={setFiltroPropietario}
          onLimpiar={limpiarFiltros}
        />

      </Card>

      <Card>

        <h3>Lista de inventario</h3>

        <p style={{ marginBottom: "0.75rem", opacity: 0.6, fontSize: "0.9rem" }}>
          Mostrando <strong>{articulosFiltrados.length}</strong> de{" "}
          <strong>{articulos?.length || 0}</strong> artículos.
        </p>

        <Table
          columns={columnas}
          data={articulosFiltrados}
          emptyMessage="No se encontraron artículos con esos filtros."
          onRowClick={(articulo) => setArticuloDetalle(articulo)}   
        />

      </Card>

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        onConfirm={ejecutarConfirmacion}
        onCancel={cerrarConfirmacion}
      />

      <ArticuloDetalle
        open={!!articuloDetalle}
        articulo={articuloDetalle}
        onClose={() => setArticuloDetalle(null)}
      />

    </div>

  );

}