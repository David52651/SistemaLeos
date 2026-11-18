import { useState, useMemo } from "react";

import { useInventario } from "../hooks/useInventario";

import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";

import InventarioFilters from "../components/InventarioFilters";
import ArticuloDetalle from "../components/ArticuloDetalle"; 

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
  
  // Estado para el modal (ahora guardará el grupo entero)
  const [grupoDetalle, setGrupoDetalle] = useState(null);


  /* ==========================================
     1. AGRUPAR ARTÍCULOS POR NOMBRE
  ========================================== */
  const articulosAgrupados = useMemo(() => {
    if (!articulos) return [];
    
    const agrupados = {};

    articulos.forEach(art => {
      // Creamos una "llave" única combinando nombre, categoría y propietario
      const key = `${art.nombre}-${art.categoria_id}-${art.propietario_id}`;
      
      if (!agrupados[key]) {
        agrupados[key] = {
          id: key, // Usamos esta llave como ID del grupo
          nombre: art.nombre,
          codigoBase: art.codigo.replace(/-[^-]+$/, ''), // Quita la talla del final
          categoria: art.categorias,
          propietario: art.propietarios,
          imagen_url: art.imagen_url, // Tomamos la primera imagen que encuentre
          tallas: [], // Aquí guardaremos los registros individuales
          stockTotal: 0,
          activos: 0,
        };
      }
      
      // Agregamos la talla al grupo y sumamos stock
      agrupados[key].tallas.push(art);
      agrupados[key].stockTotal += art.stock_actual;
      if (art.activo) agrupados[key].activos++;
    });

    return Object.values(agrupados);
  }, [articulos]);


  /* ==========================================
     2. APLICAR FILTROS A LOS GRUPOS
  ========================================== */
  const articulosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return articulosAgrupados.filter((grupo) => {
      // Buscar por nombre del grupo o propietario
      const coincideBusqueda = !texto || 
        grupo.nombre.toLowerCase().includes(texto) || 
        grupo.propietario?.nombre?.toLowerCase().includes(texto) ||
        grupo.codigoBase.toLowerCase().includes(texto);

      const coincideCategoria = !filtroCategoria || grupo.tallas[0].categoria_id === filtroCategoria;
      const coincidePropietario = !filtroPropietario || grupo.tallas[0].propietario_id === filtroPropietario;
      
      // Si se busca por talla, verificamos si el grupo contiene esa talla
      const coincideTalla = !filtroTalla || grupo.tallas.some(t => t.talla_id === filtroTalla);

      return coincideBusqueda && coincideCategoria && coincidePropietario && coincideTalla;
    });

  }, [articulosAgrupados, busqueda, filtroCategoria, filtroTalla, filtroPropietario]);


  function limpiarFiltros() {
    setBusqueda("");
    setFiltroCategoria("");
    setFiltroTalla("");
    setFiltroPropietario("");
  }


  if (isLoading) {
    return <p>Cargando inventario...</p>;
  }


  /* ==========================================
     COLUMNAS DE LA TABLA AGRUPADA
  ========================================== */
  const columnas = [
    { 
      key: "nombre", 
      title: "Artículo", 
      render: (grupo) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {grupo.imagen_url ? (
            <img 
              src={grupo.imagen_url} 
              alt="mini" 
              style={{ width: "35px", height: "35px", borderRadius: "4px", objectFit: "cover" }} 
            />
          ) : (
            <div style={{ width: "35px", height: "35px", borderRadius: "4px", background: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center" }}>📷</div>
          )}
          <div>
            <strong style={{ display: "block" }}>{grupo.nombre}</strong>
            <small style={{ color: "var(--text-muted)" }}>Base: {grupo.codigoBase}</small>
          </div>
        </div>
      )
    },
    { 
      key: "categoria", 
      title: "Categoría", 
      render: (grupo) => grupo.categoria?.nombre || "-" 
    },
    { 
      key: "propietario", 
      title: "Propietario", 
      render: (grupo) => grupo.propietario?.nombre || "-" 
    },
    { 
      key: "tallas", 
      title: "Tallas", 
      render: (grupo) => (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {grupo.tallas.map(t => (
            <span 
              key={t.id} 
              style={{ 
                padding: "2px 8px", 
                background: t.activo ? "var(--bg-selected)" : "var(--bg-hover)",
                color: t.activo ? "var(--text-primary)" : "var(--text-muted)",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 500
              }}
            >
              {t.tallas?.nombre} ({t.stock_actual})
            </span>
          ))}
        </div>
      )
    },
    {
      key: "stock",
      title: "Stock Total",
      render: (grupo) => <strong>{grupo.stockTotal}</strong>,
    },
    {
      key: "acciones",
      title: "Acciones",
      render: (grupo) => (
        <div className="table-actions" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setGrupoDetalle(grupo)}
          >
            Ver Detalles
          </Button>
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
        Haz clic en cualquier fila para ver el desglose por tallas y gestionar su estado.
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
          Mostrando <strong>{articulosFiltrados.length}</strong> modelos de prendas.
        </p>

        <Table
          columns={columnas}
          data={articulosFiltrados}
          emptyMessage="No se encontraron artículos con esos filtros."
          onRowClick={(grupo) => setGrupoDetalle(grupo)}   
        />
      </Card>

      {/* El modal ahora recibe el grupo completo y la función refetch */}
      <ArticuloDetalle
        open={!!grupoDetalle}
        grupo={grupoDetalle}
        onClose={() => setGrupoDetalle(null)}
        onRefresh={refetch}
      />

    </div>
  );
}