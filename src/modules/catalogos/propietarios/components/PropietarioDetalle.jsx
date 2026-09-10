import CatalogoModal from "@/modules/inventario/components/CatalogoModal";


export default function PropietarioDetalle({ open, propietario, onClose }) {

    if (!propietario) return null;

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

        tipoBadge: {
            display: "inline-block",
            marginTop: "6px",
            padding: "4px 10px",
            background: "rgba(168, 85, 247, 0.15)",
            color: "#c084fc",
            borderRadius: "6px",
            fontSize: "0.8rem",
            letterSpacing: "0.5px",
            textTransform: "capitalize",
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

        link: {
            fontSize: "0.95rem",
            lineHeight: 1.3,
            color: "#38bdf8",
            textDecoration: "none",
            wordBreak: "break-all",
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

        contactoBox: {
            background: "rgba(56, 189, 248, 0.06)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            borderRadius: "8px",
            padding: "14px",
            marginBottom: "1.5rem",
        },

        contactoItem: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px 0",
        },

        contactoIcon: {
            fontSize: "1.1rem",
            opacity: 0.7,
            width: "20px",
            textAlign: "center",
        },

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

    return (
        <CatalogoModal
            open={open}
            title="Detalle del propietario"
            onClose={onClose}
            size="lg"
        >
            <div>

                {/* HEADER: Nombre + Estado */}
                <div style={styles.headerBox}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={styles.titulo}>{propietario.nombre}</h2>
                        {propietario.tipo && (
                            <span style={styles.tipoBadge}>
                                {propietario.tipo}
                            </span>
                        )}
                    </div>
                    <span style={styles.estadoBadge(propietario.activo)}>
                        {propietario.activo ? "Activo" : "Inactivo"}
                    </span>
                </div>

                {/* CONTACTO destacado */}
                {(propietario.telefono || propietario.correo) && (
                    <div style={styles.contactoBox}>

                        {propietario.telefono && (
                            <div style={styles.contactoItem}>
                                <span style={styles.contactoIcon}>📞</span>
                                <a
                                    href={`tel:${propietario.telefono}`}
                                    style={styles.link}
                                >
                                    {propietario.telefono}
                                </a>
                            </div>
                        )}

                        {propietario.correo && (
                            <div style={styles.contactoItem}>
                                <span style={styles.contactoIcon}>✉️</span>
                                <a
                                    href={`mailto:${propietario.correo}`}
                                    style={styles.link}
                                >
                                    {propietario.correo}
                                </a>
                            </div>
                        )}

                    </div>
                )}

                {/* GRID: Datos generales */}
                <div style={styles.grid}>

                    <div style={styles.item}>
                        <span style={styles.label}>Tipo</span>
                        <span style={{
                            ...styles.value,
                            textTransform: "capitalize",
                        }}>
                            {propietario.tipo || "-"}
                        </span>
                    </div>

                    <div style={styles.item}>
                        <span style={styles.label}>Estado</span>
                        <span style={styles.value}>
                            {propietario.activo ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                </div>

                {/* Observaciones */}
                {propietario.observaciones && (
                    <div style={styles.seccion}>
                        <div style={styles.seccionTitulo}>Observaciones</div>
                        <p style={styles.seccionTexto}>{propietario.observaciones}</p>
                    </div>
                )}

                {/* Footer con fechas */}
                <div style={styles.footer}>
                    <span>
                        Registrado: {formatearFecha(propietario.created_at)}
                    </span>
                    {propietario.updated_at && (
                        <span>
                            Actualizado: {formatearFecha(propietario.updated_at)}
                        </span>
                    )}
                </div>

            </div>
        </CatalogoModal>
    );
}