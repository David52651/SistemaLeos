import { useState } from "react";
import CatalogoModal from "./CatalogoModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "sonner";
import { activarArticulo, desactivarArticulo } from "../services/inventario.service";

// ⬅️ NUEVO: Importamos el CSS
import "@/styles/modules/articuloDetalle.css";

export default function ArticuloDetalle({ open, grupo, onClose, onRefresh }) {
    const [imagenExpandida, setImagenExpandida] = useState(false);
    
    if (!grupo) return null;

    const artReferencia = grupo.tallas[0];

    async function toggleEstado(talla) {
        try {
            if (talla.activo) {
                await desactivarArticulo(talla.id);
                toast.success("Talla desactivada correctamente");
            } else {
                await activarArticulo(talla.id);
                toast.success("Talla activada correctamente");
            }
            if (onRefresh) onRefresh(); 
        } catch (error) {
            toast.error(error.message);
        }
    }

    function formatearFecha(fechaISO) {
        if (!fechaISO) return "-";
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString("es-PE", {
            day: "2-digit", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    }

    return (
        <>
            <CatalogoModal open={open} title="Detalle del Artículo" onClose={onClose} size="lg">
                <div>
                    {/* HEADER */}
                    <div className="detalle-header">
                        <div 
                            className={`detalle-imagen-container ${grupo.imagen_url ? 'clickable' : ''}`}
                            onClick={() => grupo.imagen_url && setImagenExpandida(true)}
                        >
                            {grupo.imagen_url ? (
                                <img src={grupo.imagen_url} alt={grupo.nombre} className="detalle-imagen" />
                            ) : (
                                <span className="detalle-imagen-vacia">📷</span>
                            )}
                        </div>

                        <div className="detalle-titulo-container">
                            <h2 className="detalle-titulo">{grupo.nombre}</h2>
                            <span className="detalle-codigo">{grupo.codigoBase}-[Talla]</span>
                            <span className={`detalle-estado-badge ${grupo.activos > 0 ? 'activo' : 'inactivo'}`}>
                                {grupo.activos} Tallas Activas
                            </span>
                        </div>
                    </div>

                    {/* STOCK TOTAL */}
                    <div className="detalle-stock-box">
                        <span className="detalle-label">Stock Total Sumado</span>
                        <span className="detalle-stock-numero">{grupo.stockTotal}</span>
                        <span style={{ marginLeft: "8px", opacity: 0.6, fontSize: "0.85rem" }}>unidades en todas las tallas</span>
                    </div>

                    {/* DESGLOSE POR TALLAS */}
                    <div className="detalle-seccion">
                        <div className="detalle-seccion-titulo">Gestión de Tallas</div>
                        <div className="detalle-tallas-lista">
                            {grupo.tallas.map(t => (
                                <div key={t.id} className="detalle-talla-item">
                                    <div>
                                        <strong style={{ fontSize: "1.1rem" }}>Talla {t.tallas?.nombre}</strong>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                            Cód: {t.codigo}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        <span>Stock: <strong>{t.stock_actual}</strong></span>
                                        <Button 
                                            variant={t.activo ? "danger" : "success"} 
                                            onClick={() => toggleEstado(t)}
                                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                        >
                                            {t.activo ? "Desactivar" : "Activar"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* INFORMACIÓN GENERAL EN UN CARD */}
                    <div style={{ marginTop: "2rem" }}>
                        <Card>
                            <div className="detalle-seccion">
                                <div className="detalle-seccion-titulo">Información General</div>
                                
                                <div className="detalle-grid">
                                    <div className="detalle-item">
                                        <span className="detalle-label">Categoría</span>
                                        <span className="detalle-value">{artReferencia.categorias?.nombre || "-"}</span>
                                    </div>
                                    <div className="detalle-item">
                                        <span className="detalle-label">Propietario</span>
                                        <span className="detalle-value">{artReferencia.propietarios?.nombre || "-"}</span>
                                    </div>
                                    <div className="detalle-item">
                                        <span className="detalle-label">Género</span>
                                        <span className="detalle-value" style={{ textTransform: "capitalize" }}>{artReferencia.genero || "-"}</span>
                                    </div>
                                    <div className="detalle-item">
                                        <span className="detalle-label">Stock Mínimo Permitido</span>
                                        <span className="detalle-value">{artReferencia.stock_min} unidades</span>
                                    </div>
                                </div>

                                {/* Descripción y Observaciones dentro del Card */}
                                {artReferencia.descripcion && (
                                    <div style={{ marginTop: "1.2rem" }}>
                                        <div className="detalle-seccion-titulo">Descripción</div>
                                        <p className="detalle-texto-caja">{artReferencia.descripcion}</p>
                                    </div>
                                )}

                                {artReferencia.observaciones && (
                                    <div style={{ marginTop: "1.2rem" }}>
                                        <div className="detalle-seccion-titulo">Observaciones</div>
                                        <p className="detalle-texto-caja">{artReferencia.observaciones}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Footer con fechas */}
                    <div className="detalle-footer">
                        <span>Registrado: {formatearFecha(artReferencia.created_at)}</span>
                        {artReferencia.updated_at && <span>Actualizado: {formatearFecha(artReferencia.updated_at)}</span>}
                    </div>

                </div>
            </CatalogoModal>

            {/* MODAL DE ZOOM DE IMAGEN */}
            <CatalogoModal
                open={imagenExpandida}
                title={grupo.nombre}
                onClose={() => setImagenExpandida(false)}
                size="md"
            >
                <div className="zoom-imagen-container">
                    <img 
                        src={grupo.imagen_url} 
                        alt={grupo.nombre} 
                        className="zoom-imagen" 
                    />
                </div>
            </CatalogoModal>
        </>
    );
}