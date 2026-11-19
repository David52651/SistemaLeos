import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Select from "react-select";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import CatalogoModal from "@/modules/inventario/components/CatalogoModal";

import { useAuth } from "@/contexts/AuthContext";
import { useAlquileres } from "../hooks/useAlquileres";
import { useMovimientos } from "@/modules/movimientos/hooks/useMovimientos";
import { exportToCSV } from "@/utils/exportToCSV";

export default function AlquileresPage() {
  const { perfil } = useAuth();
  const { alquileres, isLoading, crear, isCreando, devolver } = useAlquileres();
  const { articulos } = useMovimientos();

  // ==========================================
  // ESTADOS DE UI
  // ==========================================
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // ==========================================
  // ESTADOS DEL FORMULARIO (Nuevo Alquiler)
  // ==========================================
  const [cliente, setCliente] = useState("");
  const [dni, setDni] = useState("");
  const [contacto, setContacto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tipo, setTipo] = useState("Conjunto");

  const getManana = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split("T")[0];
  };
  const [fechaDevolucion, setFechaDevolucion] = useState(getManana());
  const [observaciones, setObservaciones] = useState("");

  // ==========================================
  // ESTADOS DEL CARRITO Y BUSCADOR
  // ==========================================
  const [carrito, setCarrito] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [notaArticulo, setNotaArticulo] = useState("");

  // ==========================================
  // ESTADOS MODALES (Factura y Devolución)
  // ==========================================
  const [alquilerFactura, setAlquilerFactura] = useState(null);
  const [alquilerDevolucion, setAlquilerDevolucion] = useState(null);
  const [obsDevolucion, setObsDevolucion] = useState({});

  // ==========================================
  // EFECTOS Y MEMOS
  // ==========================================

  useEffect(() => {
    if (!alquileres.length) return;
    const hoy = new Date();
    const retrasados = alquileres.filter(
      (a) =>
        a.estado === "Activo" && new Date(a.fecha_devolucion_pactada) < hoy,
    );

    if (retrasados.length > 0) {
      toast.warning(
        `⚠️ Tienes ${retrasados.length} alquiler(es) retrasado(s)`,
        {
          duration: 5000,
          position: "top-center",
        },
      );
    }
  }, [alquileres]);

  const alquileresFiltrados = useMemo(() => {
    if (!busqueda) return alquileres;
    const term = busqueda.toLowerCase();

    return alquileres.filter((a) => {
      const matchCliente = a.cliente_nombre?.toLowerCase().includes(term);
      const matchDni = a.cliente_dni?.toLowerCase().includes(term);
      const matchContacto = a.cliente_contacto?.toLowerCase().includes(term);
      const matchArticulo = a.alquiler_detalles?.some(
        (d) =>
          d.articulos?.codigo?.toLowerCase().includes(term) ||
          d.articulos?.nombre?.toLowerCase().includes(term),
      );
      return matchCliente || matchDni || matchContacto || matchArticulo;
    });
  }, [alquileres, busqueda]);

  // 1. Agrupar nombres únicos para el primer buscador
  const opcionesModelos = useMemo(() => {
    const modelos = new Set();
    articulos.forEach((a) => modelos.add(a.nombre));
    return Array.from(modelos)
      .sort()
      .map((nombre) => ({ value: nombre, label: nombre }));
  }, [articulos]);

  // 2. Filtrar las tallas disponibles del modelo seleccionado
  const opcionesTallas = useMemo(() => {
    if (!modeloSeleccionado) return [];

    return articulos
      .filter((a) => a.nombre === modeloSeleccionado)
      .map((a) => {
        const enCarrito = carrito.filter((item) => item.articulo_id === a.id);
        const cantidadEnCarrito = enCarrito.reduce(
          (sum, item) => sum + item.cantidad,
          0,
        );
        const stockDisponible = a.stock_actual - cantidadEnCarrito;

        return {
          value: a.id,
          label: `Talla ${a.tallas?.nombre || "Única"} (Stock: ${stockDisponible})`,
          stock: stockDisponible,
        };
      })
      .filter((t) => t.stock > 0);
  }, [modeloSeleccionado, articulos, carrito]);

  // ==========================================
  // FUNCIONES DEL CARRITO
  // ==========================================
  function agregarAlCarrito() {
    if (!tallaSeleccionada) return toast.error("Selecciona una talla");

    const articulo = articulos.find((a) => a.id === tallaSeleccionada);

    const enCarrito = carrito.filter(
      (item) => item.articulo_id === articulo.id,
    );
    const cantidadEnCarrito = enCarrito.reduce(
      (sum, item) => sum + item.cantidad,
      0,
    );
    const stockDisponible = articulo.stock_actual - cantidadEnCarrito;

    if (Number(cantidad) > stockDisponible) {
      return toast.warning(
        `Stock insuficiente: Solo puedes agregar ${stockDisponible} unidades más.`,
        {
          duration: 4000,
          position: "top-center",
          style: { background: "#ff9800", color: "#fff", fontWeight: "bold" },
        },
      );
    }

    if (tipo === "Conjunto") {
      if (cantidadEnCarrito > 0)
        return toast.warning(
          "En un Conjunto solo puedes alquilar 1 unidad de esta prenda.",
        );
      if (Number(cantidad) > 1)
        return toast.warning(
          "En un Conjunto solo puedes alquilar 1 unidad por prenda.",
        );
    }

    const nuevoItem = {
      articulo_id: articulo.id,
      nombre: articulo.nombre,
      talla: articulo.tallas?.nombre || "-",
      codigo: articulo.codigo,
      cantidad: Number(cantidad),
      observacion_salida: notaArticulo || "",
    };

    setCarrito([...carrito, nuevoItem]);

    setModeloSeleccionado("");
    setTallaSeleccionada("");
    setCantidad(1);
    setNotaArticulo("");
  }

  function quitarDelCarrito(index) {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  }

  // ==========================================
  // REGISTRAR ALQUILER
  // ==========================================
  async function handleSubmit(e) {
    e.preventDefault();
    if (carrito.length === 0)
      return toast.error("Agrega al menos un artículo al carrito");

    // ⬅️ NUEVA VALIDACIÓN ESTRICTA
    if (dni.length !== 8) {
      return toast.warning(
        "El DNI debe tener exactamente 8 dígitos numéricos.",
        {
          duration: 4000,
          position: "top-center",
          style: { background: "#ff9800", color: "#fff", fontWeight: "bold" },
        },
      );
    }

    try {
      await crear({
        usuario_id: perfil.id,
        cliente_nombre: cliente,
        cliente_dni: dni,
        cliente_contacto: contacto,
        cliente_direccion: direccion,
        tipo,
        fecha_devolucion_pactada: new Date(
          fechaDevolucion + "T23:59:59",
        ).toISOString(),
        observaciones,
        detalles: carrito.map((item) => ({
          articulo_id: item.articulo_id,
          cantidad: item.cantidad,
          observacion_salida: item.observacion_salida,
        })),
      });

      toast.success("Alquiler registrado correctamente");
      setCliente("");
      setDni("");
      setContacto("");
      setDireccion("");
      setFechaDevolucion(getManana());
      setObservaciones("");
      setCarrito([]);
      setModalNuevoOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  }

  // ==========================================
  // DEVOLVER ALQUILER
  // ==========================================
  function abrirModalDevolucion(alquiler) {
    setAlquilerDevolucion(alquiler);
    const obsIniciales = {};
    alquiler.alquiler_detalles.forEach((d) => (obsIniciales[d.id] = ""));
    setObsDevolucion(obsIniciales);
  }

  async function confirmarDevolucion() {
    try {
      const detalles = alquilerDevolucion.alquiler_detalles.map((d) => ({
        id_detalle: d.id,
        observacion: obsDevolucion[d.id] || "Todo limpio y en buen estado",
      }));

      await devolver({
        id: alquilerDevolucion.id,
        usuarioId: perfil.id,
        detallesDevolucion: detalles,
      });

      toast.success("Devolución registrada con éxito");
      setAlquilerDevolucion(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  // ==========================================
  // COLUMNAS DE LA TABLA
  // ==========================================
  const columnas = [
    {
      key: "cliente",
      title: "Cliente",
      render: (row) => (
        <div>
          <strong>{row.cliente_nombre}</strong>
          <br />
          <small>DNI: {row.cliente_dni || "-"}</small>
          <br />
          <small>Tel: {row.cliente_contacto || "-"}</small>
        </div>
      ),
    },
    {
      key: "articulos",
      title: "Artículos",
      render: (row) => (
        <div style={{ fontSize: "0.85rem" }}>
          {row.alquiler_detalles?.map((d, i) => (
            <div key={i}>
              {d.cantidad}x {d.articulos?.nombre} ({d.articulos?.tallas?.nombre}
              )
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "fecha_devolucion_pactada",
      title: "Devolución Pactada",
      render: (row) =>
        new Date(row.fecha_devolucion_pactada).toLocaleDateString(),
    },
    {
      key: "estado",
      title: "Estado",
      render: (row) => {
        const isOverdue =
          row.estado === "Activo" &&
          new Date() > new Date(row.fecha_devolucion_pactada);
        return (
          <Badge
            variant={
              row.estado === "Devuelto"
                ? "success"
                : isOverdue
                  ? "danger"
                  : "warning"
            }
          >
            {row.estado === "Devuelto"
              ? "Devuelto"
              : isOverdue
                ? "Retrasado"
                : "Activo"}
          </Badge>
        );
      },
    },
    {
      key: "acciones",
      title: "Acciones",
      render: (row) => (
        <div className="table-actions" onClick={(e) => e.stopPropagation()}>
          {row.estado === "Activo" ? (
            <Button variant="success" onClick={() => abrirModalDevolucion(row)}>
              Devolver
            </Button>
          ) : (
            <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>
              Completado
            </span>
          )}
        </div>
      ),
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Alquileres</h1>
        <Button variant="primary" onClick={() => setModalNuevoOpen(true)}>
          + Nuevo Alquiler
        </Button>
      </div>

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
          <div style={{ flex: 1, minWidth: "300px" }}>
            <Input
              placeholder="🔍 Buscar por DNI, Nombre, Teléfono o Prenda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Botón de exportar a CSV */}
          <Button
            variant="success"
            onClick={() =>
              exportToCSV(alquileresFiltrados, columnas, "historial_alquileres")
            }
            style={{ height: "38px", padding: "0 16px" }}
          >
            Exportar a CSV
          </Button>
        </div>
        <Table
          columns={columnas}
          data={alquileresFiltrados}
          loading={isLoading}
          emptyMessage="No se encontraron alquileres."
          onRowClick={(row) => setAlquilerFactura(row)}
        />
      </Card>

      {/* MODAL NUEVO ALQUILER (Size XL) */}
      <CatalogoModal
        open={modalNuevoOpen}
        title="Registrar Nuevo Alquiler"
        onClose={() => setModalNuevoOpen(false)}
        size="xl"
      >
        /* FORMULARIO CON NUEVO GRID */
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Fila 1: 3 columnas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <Input
              label="Cliente / Agrupación"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
            <Input
              label="DNI / Carnet"
              value={dni}
              onChange={(e) => {
                const soloNumeros = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 8);
                setDni(soloNumeros);
              }}
              required
              placeholder="Ej: 12345678"
            />
            <Input
              label="Contacto (Teléfono)"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
            />
          </div>

          {/* Fila 2: Dirección(2), Tipo(1), Fecha(1) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <Input
              label="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />

            <CustomSelect
              label="Tipo"
              value={tipo}
              onChange={(e) => {
                const nuevoTipo = e.target.value;
                if (carrito.length > 0) {
                  if (
                    window.confirm(
                      "Cambiar el tipo vaciará el carrito. ¿Continuar?",
                    )
                  ) {
                    setCarrito([]);
                    setTipo(nuevoTipo);
                  }
                } else {
                  setTipo(nuevoTipo);
                }
              }}
            >
              <option value="Conjunto">Conjunto</option>
              <option value="Paquete">Paquete</option>
            </CustomSelect>

            <Input
              label="Fecha Devolución"
              type="date"
              value={fechaDevolucion}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              required
            />
          </div>

          {/* Carrito */}
          <div
            style={{
              background: "var(--bg-hover)",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
            }}
          >
            <h4
              style={{
                marginTop: 0,
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              Agregar artículos al {tipo}
            </h4>

            {/* Fila 3: Buscador Ancho Completo */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label required">1. Buscar Prenda</label>
              <Select
                options={opcionesModelos}
                value={
                  opcionesModelos.find((o) => o.value === modeloSeleccionado) ||
                  null
                }
                onChange={(opcion) => {
                  setModeloSeleccionado(opcion ? opcion.value : "");
                  setTallaSeleccionada("");
                }}
                placeholder="Escribe el nombre de la prenda..."
                isClearable
                isSearchable
                noOptionsMessage={() => "No se encontraron prendas"}
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    background: "var(--bg-input)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                    minHeight: "42px",
                  }),
                  menu: (base) => ({
                    ...base,
                    background: "var(--bg-card)",
                    zIndex: 9999,
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isFocused
                      ? "var(--bg-hover)"
                      : "transparent",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "var(--text-primary)",
                  }),
                  input: (base) => ({ ...base, color: "var(--text-primary)" }),
                }}
              />
            </div>

            {/* Fila 4: Talla, Cant, Nota, Botón */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1.5 }}>
                <label
                  className="form-label required"
                  style={{
                    display: "block",
                    height: "24px",
                    marginBottom: "8px",
                  }}
                >
                  2. Talla
                </label>
                <Select
                  options={opcionesTallas}
                  value={
                    opcionesTallas.find((o) => o.value === tallaSeleccionada) ||
                    null
                  }
                  onChange={(opcion) =>
                    setTallaSeleccionada(opcion ? opcion.value : "")
                  }
                  placeholder={
                    modeloSeleccionado ? "Selecciona talla..." : "Elige prenda"
                  }
                  isDisabled={!modeloSeleccionado}
                  isClearable
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      background: "var(--bg-input)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                      minHeight: "42px",
                    }),
                    menu: (base) => ({
                      ...base,
                      background: "var(--bg-card)",
                      zIndex: 9999,
                    }),
                    option: (base, state) => ({
                      ...base,
                      background: state.isFocused
                        ? "var(--bg-hover)"
                        : "transparent",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "var(--text-primary)",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "var(--text-primary)",
                    }),
                  }}
                />
              </div>

              <div style={{ width: "100px" }}>
                <label
                  className="form-label"
                  style={{
                    display: "block",
                    height: "24px",
                    marginBottom: "8px",
                  }}
                >
                  Cant.
                </label>
                <Input
                  type="number"
                  min="1"
                  value={tipo === "Conjunto" ? 1 : cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  disabled={tipo === "Conjunto" || !tallaSeleccionada}
                  style={{ height: "42px" }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label
                  className="form-label"
                  style={{
                    display: "block",
                    height: "24px",
                    marginBottom: "8px",
                  }}
                >
                  Nota (opcional)
                </label>
                <Input
                  placeholder="Ej: Tiene un hueco"
                  value={notaArticulo}
                  onChange={(e) => setNotaArticulo(e.target.value)}
                  disabled={!tallaSeleccionada}
                  style={{ height: "42px" }}
                />
              </div>

              <div style={{ paddingTop: "32px" }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={agregarAlCarrito}
                  disabled={!tallaSeleccionada}
                  style={{ height: "42px", width: "100%" }}
                >
                  + Agregar
                </Button>
              </div>
            </div>

            {/* Tabla del Carrito */}
            <div style={{ marginTop: "1.5rem" }}>
              {carrito.length > 0 ? (
                <Table
                  columns={[
                    { key: "codigo", title: "Código" },
                    {
                      key: "nombre",
                      title: "Artículo",
                      render: (item) => `${item.nombre} (${item.talla})`,
                    },
                    { key: "cantidad", title: "Cant." },
                    {
                      key: "observacion_salida",
                      title: "Observación",
                      render: (item) => item.observacion_salida || "-",
                    },
                    {
                      key: "acciones",
                      title: "",
                      render: (item, index) => (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => quitarDelCarrito(index)}
                        >
                          ✖
                        </Button>
                      ),
                    },
                  ]}
                  data={carrito}
                />
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    opacity: 0.5,
                    margin: "1rem 0",
                  }}
                >
                  No hay artículos en el carrito
                </p>
              )}
            </div>
          </div>

          <Input
            label="Observaciones generales"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ej: Se lleva en una bolsa negra..."
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalNuevoOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isCreando}>
              Registrar Alquiler
            </Button>
          </div>
        </form>
      </CatalogoModal>

      {/* ... MODALES FACTURA Y DEVOLUCIÓN SE MANTIENEN IGUAL ... */}
      <CatalogoModal
        open={!!alquilerFactura}
        title="Detalle del Alquiler"
        onClose={() => setAlquilerFactura(null)}
        size="md"
      >
        {alquilerFactura && (
          <div style={{ fontSize: "0.9rem" }}>
            <div
              style={{
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <p>
                <strong>Cliente:</strong> {alquilerFactura.cliente_nombre}
              </p>
              <p>
                <strong>DNI:</strong> {alquilerFactura.cliente_dni}
              </p>
              <p>
                <strong>Contacto:</strong>{" "}
                {alquilerFactura.cliente_contacto || "-"}
              </p>
              <p>
                <strong>Dirección:</strong>{" "}
                {alquilerFactura.cliente_direccion || "-"}
              </p>
              <p>
                <strong>Devolución Pactada:</strong>{" "}
                {new Date(
                  alquilerFactura.fecha_devolucion_pactada,
                ).toLocaleDateString()}
              </p>
            </div>
            <h4>Artículos:</h4>
            <ul style={{ paddingLeft: "1rem", marginBottom: "1rem" }}>
              {alquilerFactura.alquiler_detalles?.map((d, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <strong>
                    {d.cantidad}x {d.articulos?.nombre} (
                    {d.articulos?.tallas?.nombre})
                  </strong>{" "}
                  ({d.articulos?.codigo})
                  <br />
                  <span style={{ color: "var(--text-muted)" }}>
                    Salida: {d.observacion_salida || "Sin observaciones"}
                  </span>
                  {d.observacion_devolucion && (
                    <>
                      <br />
                      <span style={{ color: "var(--color-primary)" }}>
                        Devolución: {d.observacion_devolucion}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {alquilerFactura.observaciones && (
              <p
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  background: "var(--bg-hover)",
                  borderRadius: "4px",
                }}
              >
                <strong>Obs. General:</strong> {alquilerFactura.observaciones}
              </p>
            )}
          </div>
        )}
      </CatalogoModal>

      <CatalogoModal
        open={!!alquilerDevolucion}
        title="Registrar Devolución"
        onClose={() => setAlquilerDevolucion(null)}
        size="md"
      >
        {alquilerDevolucion && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <p>
              Revisa el estado de cada prenda. Si está todo bien, puedes dejarlo
              en blanco.
            </p>
            {alquilerDevolucion.alquiler_detalles.map((detalle) => (
              <div
                key={detalle.id}
                style={{
                  background: "var(--bg-hover)",
                  padding: "0.5rem",
                  borderRadius: "6px",
                }}
              >
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {detalle.cantidad}x {detalle.articulos?.nombre} (
                  {detalle.articulos?.tallas?.nombre})
                </p>
                <small
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    opacity: 0.7,
                  }}
                >
                  Salida: {detalle.observacion_salida || "Sin novedades"}
                </small>
                <Input
                  placeholder="Observación de retorno..."
                  value={obsDevolucion[detalle.id] || ""}
                  onChange={(e) =>
                    setObsDevolucion({
                      ...obsDevolucion,
                      [detalle.id]: e.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                  }}
                  onClick={() =>
                    setObsDevolucion({
                      ...obsDevolucion,
                      [detalle.id]: "Todo limpio y en buen estado",
                    })
                  }
                >
                  ✓ Todo limpio
                </Button>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button variant="primary" onClick={confirmarDevolucion}>
                Confirmar Devolución
              </Button>
            </div>
          </div>
        )}
      </CatalogoModal>
    </div>
  );
}
