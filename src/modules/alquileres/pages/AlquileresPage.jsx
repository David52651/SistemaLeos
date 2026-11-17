import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Select from "react-select"; // ⬅️ Usamos react-select para el buscador

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/Select"; // ⬅️ Renombramos tu Select original
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import CatalogoModal from "@/modules/inventario/components/CatalogoModal";

import { useAuth } from "@/contexts/AuthContext";
import { useAlquileres } from "../hooks/useAlquileres";
import { useMovimientos } from "@/modules/movimientos/hooks/useMovimientos";

export default function AlquileresPage() {
    const { perfil } = useAuth();
    const { alquileres, isLoading, crear, isCreando, devolver } = useAlquileres();
    const { articulos } = useMovimientos(); 

    // ==========================================
    // ESTADOS DEL FORMULARIO
    // ==========================================
    const [cliente, setCliente] = useState("");
    const [dni, setDni] = useState("");
    const [contacto, setContacto] = useState("");
    const [direccion, setDireccion] = useState("");
    const [tipo, setTipo] = useState("Conjunto");
    
    const getManana = () => {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        return manana.toISOString().split('T')[0];
    };
    const [fechaDevolucion, setFechaDevolucion] = useState(getManana());
    const [observaciones, setObservaciones] = useState("");

    // ==========================================
    // ESTADOS DEL CARRITO Y BUSCADOR
    // ==========================================
    const [carrito, setCarrito] = useState([]);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [notaArticulo, setNotaArticulo] = useState("");

    // ==========================================
    // ESTADOS MODALES
    // ==========================================
    const [alquilerFactura, setAlquilerFactura] = useState(null);
    const [alquilerDevolucion, setAlquilerDevolucion] = useState(null);
    const [obsDevolucion, setObsDevolucion] = useState({});

    // ==========================================
    // EFECTOS Y MEMOS
    // ==========================================
    
    // Aviso de retrasos al entrar
    useEffect(() => {
        if (!alquileres.length) return;
        
        const hoy = new Date();
        const retrasados = alquileres.filter(a => 
            a.estado === "Activo" && new Date(a.fecha_devolucion_pactada) < hoy
        );

        if (retrasados.length > 0) {
            toast.warning(`⚠️ Tienes ${retrasados.length} alquiler(es) retrasado(s)`, {
                duration: 5000,
                position: "top-center"
            });
        }
    }, [alquileres]);

    // Formatear opciones para react-select (buscador)
    const opcionesArticulos = useMemo(() => {
        return articulos.map(a => ({
            value: a.id,
            label: `${a.nombre} (Stock: ${a.stock_actual})`,
            stock: a.stock_actual
        }));
    }, [articulos]);

    // ==========================================
    // FUNCIONES DEL CARRITO
    // ==========================================
    function agregarAlCarrito() {
        if (!articuloSeleccionado) return toast.error("Selecciona un artículo");
        
        const articulo = articulos.find(a => a.id === articuloSeleccionado);
        
        if (cantidad > articulo.stock_actual) {
            return toast.error(`Solo hay ${articulo.stock_actual} unidades disponibles`);
        }

        // Validación para "Conjunto"
        if (tipo === "Conjunto") {
            const yaExiste = carrito.some(item => item.articulo_id === articuloSeleccionado);
            
            if (yaExiste) {
                return toast.error("En un Conjunto solo puedes alquilar 1 unidad de esta prenda. Cambia a 'Paquete' si necesitas más.");
            }
            if (Number(cantidad) > 1) {
                return toast.error("En un Conjunto solo puedes alquilar 1 unidad por prenda.");
            }
        }

        const nuevoItem = {
            articulo_id: articulo.id,
            nombre: articulo.nombre,
            codigo: articulo.codigo,
            cantidad: Number(cantidad),
            observacion_salida: notaArticulo || "",
        };

        setCarrito([...carrito, nuevoItem]);
        setArticuloSeleccionado(""); // Limpia el buscador
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
        if (carrito.length === 0) return toast.error("Agrega al menos un artículo al carrito");
        if (!dni) return toast.error("El DNI es obligatorio para buscar al cliente luego");

        try {
            await crear({
                usuario_id: perfil.id,
                cliente_nombre: cliente,
                cliente_dni: dni,
                cliente_contacto: contacto,
                cliente_direccion: direccion,
                tipo,
                fecha_devolucion_pactada: new Date(fechaDevolucion + "T23:59:59").toISOString(),
                observaciones,
                detalles: carrito.map(item => ({
                    articulo_id: item.articulo_id,
                    cantidad: item.cantidad,
                    observacion_salida: item.observacion_salida
                }))
            });

            toast.success("Alquiler registrado correctamente");
            setCliente(""); setDni(""); setContacto(""); setDireccion(""); 
            setFechaDevolucion(getManana()); setObservaciones(""); setCarrito([]);
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
        alquiler.alquiler_detalles.forEach(d => obsIniciales[d.id] = "");
        setObsDevolucion(obsIniciales);
    }

    async function confirmarDevolucion() {
        try {
            const detalles = alquilerDevolucion.alquiler_detalles.map(d => ({
                id_detalle: d.id,
                observacion: obsDevolucion[d.id] || "Todo limpio y en buen estado"
            }));

            await devolver({ 
                id: alquilerDevolucion.id, 
                usuarioId: perfil.id,
                detallesDevolucion: detalles
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
                    <strong>{row.cliente_nombre}</strong><br/>
                    <small>DNI: {row.cliente_dni || "-"}</small>
                </div>
            )
        },
        {
            key: "articulos",
            title: "Artículos",
            render: (row) => (
                <div style={{ fontSize: "0.85rem" }}>
                    {row.alquiler_detalles?.map((d, i) => (
                        <div key={i}>{d.cantidad}x {d.articulos?.nombre}</div>
                    ))}
                </div>
            )
        },
        {
            key: "fecha_devolucion_pactada",
            title: "Devolución Pactada",
            render: (row) => new Date(row.fecha_devolucion_pactada).toLocaleDateString()
        },
        {
            key: "estado",
            title: "Estado",
            render: (row) => {
                const isOverdue = row.estado === "Activo" && new Date() > new Date(row.fecha_devolucion_pactada);
                return (
                    <Badge variant={row.estado === "Devuelto" ? "success" : isOverdue ? "danger" : "warning"}>
                        {row.estado === "Devuelto" ? "Devuelto" : isOverdue ? "Retrasado" : "Activo"}
                    </Badge>
                );
            }
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
                        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>Completado</span>
                    )}
                </div>
            )
        }
    ];

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <div className="page-container">
            <h1>Alquileres</h1>

            <Card>
                <h3>Nuevo Alquiler</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    
                    {/* Datos del Cliente */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <Input label="Cliente / Agrupación" value={cliente} onChange={e => setCliente(e.target.value)} required />
                        <Input label="DNI / Carnet" value={dni} onChange={e => setDni(e.target.value)} required placeholder="Ej: 12345678" />
                        <Input label="Contacto (Teléfono)" value={contacto} onChange={e => setContacto(e.target.value)} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                        <Input label="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
                        
                        <CustomSelect 
                            label="Tipo" 
                            value={tipo} 
                            onChange={e => {
                                const nuevoTipo = e.target.value;
                                if (carrito.length > 0) {
                                    if (window.confirm("Cambiar el tipo vaciará el carrito actual. ¿Continuar?")) {
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
                        
                        <Input label="Fecha Devolución" type="date" value={fechaDevolucion} onChange={e => setFechaDevolucion(e.target.value)} required />
                    </div>

                    {/* Carrito */}
                    <div style={{ background: "var(--bg-hover)", padding: "1rem", borderRadius: "8px" }}>
                        <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>Agregar artículos al {tipo}</h4>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr auto", gap: "1rem", alignItems: "end", marginBottom: "1rem" }}>
                            
                            {/* ⬅️ AQUÍ ESTÁ EL NUEVO BUSCADOR CON AUTOCOMPLETADO */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label required">Artículo</label>
                                <Select
                                    options={opcionesArticulos}
                                    value={opcionesArticulos.find(o => o.value === articuloSeleccionado) || null}
                                    onChange={(opcion) => setArticuloSeleccionado(opcion ? opcion.value : "")}
                                    placeholder="Escribe para buscar..."
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
                                            minHeight: "42px"
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            background: "var(--bg-card)",
                                            zIndex: 9999
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            background: state.isFocused ? "var(--bg-hover)" : "transparent",
                                            color: "var(--text-primary)",
                                            cursor: "pointer"
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: "var(--text-primary)"
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: "var(--text-primary)"
                                        })
                                    }}
                                />
                            </div>
                            
                            {/* Cantidad */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label required">Cant.</label>
                                <input 
                                    type="number" 
                                    className="form-control"
                                    min="1" 
                                    value={tipo === "Conjunto" ? 1 : cantidad} 
                                    onChange={e => setCantidad(e.target.value)} 
                                    disabled={tipo === "Conjunto"}
                                    style={{ height: "42px" }}
                                />
                            </div>
                            
                            {/* Nota */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Nota (opcional)</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Ej: Tiene un hueco" 
                                    value={notaArticulo} 
                                    onChange={e => setNotaArticulo(e.target.value)} 
                                    style={{ height: "42px" }}
                                />
                            </div>
                            
                            <Button type="button" variant="secondary" onClick={agregarAlCarrito} style={{ height: "42px" }}>+ Agregar</Button>
                        </div>

                        {carrito.length > 0 ? (
                            <Table
                                columns={[
                                    { key: "codigo", title: "Código" },
                                    { key: "nombre", title: "Artículo" },
                                    { key: "cantidad", title: "Cant." },
                                    { key: "observacion_salida", title: "Observación", render: (item) => item.observacion_salida || "-" },
                                    { key: "acciones", title: "", render: (item, index) => (
                                        <Button type="button" variant="danger" onClick={() => quitarDelCarrito(index)}>✖</Button>
                                    )}
                                ]}
                                data={carrito}
                            />
                        ) : (
                            <p style={{ textAlign: "center", opacity: 0.5, margin: "1rem 0" }}>No hay artículos en el carrito</p>
                        )}
                    </div>

                    <Input label="Observaciones generales" value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Ej: Se lleva en una bolsa negra..." />
                    
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="submit" variant="primary" loading={isCreando}>Registrar Alquiler</Button>
                    </div>
                </form>
            </Card>

            <Card>
                <h3>Historial de Alquileres (Clic para ver factura)</h3>
                <Table 
                    columns={columnas} 
                    data={alquileres} 
                    loading={isLoading} 
                    emptyMessage="No hay alquileres registrados."
                    onRowClick={(row) => setAlquilerFactura(row)}
                />
            </Card>

            {/* MODAL FACTURA */}
            <CatalogoModal 
                open={!!alquilerFactura} 
                title="Detalle del Alquiler" 
                onClose={() => setAlquilerFactura(null)}
                size="md"
            >
                {alquilerFactura && (
                    <div style={{ fontSize: "0.9rem" }}>
                        <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)" }}>
                            <p><strong>Cliente:</strong> {alquilerFactura.cliente_nombre}</p>
                            <p><strong>DNI:</strong> {alquilerFactura.cliente_dni}</p>
                            <p><strong>Contacto:</strong> {alquilerFactura.cliente_contacto || "-"}</p>
                            <p><strong>Dirección:</strong> {alquilerFactura.cliente_direccion || "-"}</p>
                            <p><strong>Devolución Pactada:</strong> {new Date(alquilerFactura.fecha_devolucion_pactada).toLocaleDateString()}</p>
                        </div>

                        <h4>Artículos:</h4>
                        <ul style={{ paddingLeft: "1rem", marginBottom: "1rem" }}>
                            {alquilerFactura.alquiler_detalles?.map((d, i) => (
                                <li key={i} style={{ marginBottom: "0.5rem" }}>
                                    <strong>{d.cantidad}x {d.articulos?.nombre}</strong> ({d.articulos?.codigo})
                                    <br/>
                                    <span style={{ color: "var(--text-muted)" }}>
                                        Salida: {d.observacion_salida || "Sin observaciones"}
                                    </span>
                                    {d.observacion_devolucion && (
                                        <>
                                            <br/>
                                            <span style={{ color: "var(--color-primary)" }}>
                                                Devolución: {d.observacion_devolucion}
                                            </span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {alquilerFactura.observaciones && (
                            <p style={{ marginTop: "1rem", padding: "0.5rem", background: "var(--bg-hover)", borderRadius: "4px" }}>
                                <strong>Obs. General:</strong> {alquilerFactura.observaciones}
                            </p>
                        )}
                    </div>
                )}
            </CatalogoModal>

            {/* MODAL DEVOLUCIÓN */}
            <CatalogoModal 
                open={!!alquilerDevolucion} 
                title="Registrar Devolución" 
                onClose={() => setAlquilerDevolucion(null)}
                size="md"
            >
                {alquilerDevolucion && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p>Revisa el estado de cada prenda. Si está todo bien, puedes dejarlo en blanco.</p>
                        
                        {alquilerDevolucion.alquiler_detalles.map((detalle) => (
                            <div key={detalle.id} style={{ background: "var(--bg-hover)", padding: "0.5rem", borderRadius: "6px" }}>
                                <p style={{ margin: 0, fontWeight: "bold" }}>{detalle.cantidad}x {detalle.articulos?.nombre}</p>
                                <small style={{ display: "block", marginBottom: "0.5rem", opacity: 0.7 }}>Salida: {detalle.observacion_salida || "Sin novedades"}</small>
                                
                                <Input 
                                    placeholder="Observación de retorno (o dejar en blanco si está limpio)"
                                    value={obsDevolucion[detalle.id] || ""}
                                    onChange={(e) => setObsDevolucion({ ...obsDevolucion, [detalle.id]: e.target.value })}
                                />
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    style={{ marginTop: "0.5rem", fontSize: "0.75rem", padding: "2px 8px" }}
                                    onClick={() => setObsDevolucion({ ...obsDevolucion, [detalle.id]: "Todo limpio y en buen estado" })}
                                >
                                    ✓ Todo limpio
                                </Button>
                            </div>
                        ))}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <Button variant="primary" onClick={confirmarDevolucion}>Confirmar Devolución</Button>
                        </div>
                    </div>
                )}
            </CatalogoModal>
        </div>
    );
}