import CatalogoModal from "./CatalogoModal";


export default function ArticuloDetalle({ open, articulo, onClose }) {

    if (!articulo) return null;

    function formatearFecha(fechaISO) {
        if (!fechaISO) return "-";
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString("es-PE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    /* ==========================================
       Estilos reutilizables
    ========================================== */

    const styles = {

        headerBox: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
        },

        titulo: {
            margin: 0,
            fontSize: "1.4rem",
            fontWeight: 600,
            lineHeight: 1.2,
        },

        codigo: {
            display: "inline-block",
            marginTop: "6px",
            padding: "4px 10px",
            background: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.5px",
        },

        estadoBadge: (activo) => ({
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: activo
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(239, 68, 68, 0.15)",
            color: activo ? "#22c55e" : "#ef4444",
            border: activo
                ? "1px solid rgba(34, 197, 94, 0.3)"
                : "1px solid rgba(239, 68, 68, 0.3)",
            whiteSpace: "nowrap",
        }),

        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            marginBottom: "1.5rem",
        },

        item: {
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "12px 14px",
        },

        label: {
            display: "block",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            opacity: 0.55,
            marginBottom: "4px",
            fontWeight: 600,
        },

        value: {
            fontSize: "0.95rem",
            lineHeight: 1.3,
            wordBreak: "break-word",
        },

        seccion: {
            marginTop: "1rem",
        },

        seccionTitulo: {
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            opacity: 0.55,
            marginBottom: "8px",
            fontWeight: 600,
        },

        seccionTexto: {
            margin: 0,
            padding: "12px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            lineHeight: 1.6,
            fontSize: "0.9rem",
            opacity: 0.9,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
        },

        stockBox: (bajo) => ({
            background: bajo
                ? "rgba(239, 68, 68, 0.08)"
                : "rgba(56, 189, 248, 0.08)",
            border: bajo
                ? "1px solid rgba(239, 68, 68, 0.25)"
                : "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "8px",
            padding: "12px 14px",
        }),

        stockNumero: (bajo) => ({
            fontSize: "1.5rem",
            fontWeight: 700,
            color: bajo ? "#ef4444" : "#38bdf8",
            lineHeight: 1,
        }),

        footer: {
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            paddingTop: "1rem",
            marginTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: "0.8rem",
            opacity: 0.55,
        },
    };

    const stockBajo = articulo.stock_actual <= articulo.stock_min;

    return (
        <CatalogoModal
            open={open}
            title="Detalle del artículo"
            onClose={onClose}
            size="lg"
        >
            <div>

                {/* HEADER: Nombre + Estado */}
                <div style={styles.headerBox}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={styles.titulo}>{articulo.nombre}</h2>
                        <span style={styles.codigo}>{articulo.codigo}</span>
                    </div>
                    <span style={styles.estadoBadge(articulo.activo)}>
                        {articulo.activo ? "Activo" : "Inactivo"}
                    </span>
                </div>

                {/* STOCK destacado */}
                <div style={{ ...styles.stockBox(stockBajo), marginBottom: "1.5rem" }}>
                    <span style={styles.label}>Stock actual</span>
                    <span style={styles.stockNumero(stockBajo)}>
                        {articulo.stock_actual}
                    </span>
                    <span style={{ marginLeft: "8px", opacity: 0.6, fontSize: "0.85rem" }}>
                        unidades (mínimo: {articulo.stock_min})
                    </span>
                    {stockBajo && (
                        <div style={{
                            marginTop: "6px",
                            fontSize: "0.8rem",
                            color: "#ef4444",
                            fontWeight: 500,
                        }}>
                            ⚠️ {articulo.stock_actual === 0 ? "Sin stock" : "Stock por debajo del mínimo"}
                        </div>
                    )}
                </div>

                {/* GRID: Clasificación */}
                <div style={styles.grid}>
                    <div style={styles.item}>
                        <span style={styles.label}>Categoría</span>
                        <span style={styles.value}>{articulo.categorias?.nombre || "-"}</span>
                    </div>

                    <div style={styles.item}>
                        <span style={styles.label}>Talla</span>
                        <span style={styles.value}>{articulo.tallas?.nombre || "-"}</span>
                    </div>

                    <div style={styles.item}>
                        <span style={styles.label}>Propietario</span>
                        <span style={styles.value}>{articulo.propietarios?.nombre || "-"}</span>
                    </div>

                    <div style={styles.item}>
                        <span style={styles.label}>Género</span>
                        <span style={{
                            ...styles.value,
                            textTransform: "capitalize",
                        }}>
                            {articulo.genero || "-"}
                        </span>
                    </div>
                </div>

                {/* Descripción */}
                {articulo.descripcion && (
                    <div style={styles.seccion}>
                        <div style={styles.seccionTitulo}>Descripción</div>
                        <p style={styles.seccionTexto}>{articulo.descripcion}</p>
                    </div>
                )}

                {/* Observaciones */}
                {articulo.observaciones && (
                    <div style={styles.seccion}>
                        <div style={styles.seccionTitulo}>Observaciones</div>
                        <p style={styles.seccionTexto}>{articulo.observaciones}</p>
                    </div>
                )}

                {/* Footer con fechas */}
                <div style={styles.footer}>
                    <span>
                        Registrado: {formatearFecha(articulo.created_at)}
                    </span>
                    {articulo.updated_at && (
                        <span>
                            Actualizado: {formatearFecha(articulo.updated_at)}
                        </span>
                    )}
                </div>

            </div>
        </CatalogoModal>
    );
}