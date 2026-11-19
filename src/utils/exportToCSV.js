export function exportToCSV(data, columns, filename = "exportacion") {
    if (!data || data.length === 0) {
        console.warn("No hay datos para exportar");
        return;
    }

    // 1. Extraer los encabezados usando los títulos de las columnas
    const headers = columns.map(col => `"${col.title}"`);
    
    const csvRows = [];
    
    // Agregar la fila de encabezados
    csvRows.push(headers.join(';'));

    // 2. Extraer los valores
    for (const row of data) {
        const values = columns.map(col => {
            let value = "";

            // Si la columna tiene un "render", intentamos obtener el texto
            if (col.render) {
                // Aquí hacemos un mapeo manual para las columnas complejas del sistema
                if (col.key === "fecha_movimiento") {
                    value = new Date(row.fecha_movimiento).toLocaleString("es-PE");
                } 
                else if (col.key === "articulo") {
                    value = `${row.articulos?.codigo || ''} - ${row.articulos?.nombre || ''}`;
                } 
                else if (col.key === "usuario") {
                    value = row.usuarios?.nombre_completo || "Sistema";
                } 
                else if (col.key === "articulos") { // Para la tabla de alquileres
                    value = row.alquiler_detalles
                        ?.map(d => `${d.cantidad}x ${d.articulos?.nombre} (${d.articulos?.tallas?.nombre || 'Única'})`)
                        .join(" | ") || "";
                } 
                else if (col.key === "cliente") { // Para la tabla de alquileres
                    value = `Nombre: ${row.cliente_nombre} | DNI: ${row.cliente_dni} | Tel: ${row.cliente_contacto || '-'}`;
                }
                else if (col.key === "estado") {
                    const isOverdue = row.estado === "Activo" && new Date() > new Date(row.fecha_devolucion_pactada);
                    value = row.estado === "Devuelto" ? "Devuelto" : isOverdue ? "Retrasado" : "Activo";
                }
                else if (col.key === "fecha_devolucion_pactada") {
                    value = new Date(row.fecha_devolucion_pactada).toLocaleDateString("es-PE");
                }
                else {
                    value = row[col.key] || ""; // Fallback
                }
            } else {
                value = row[col.key] ?? "";
            }

            // Limpiar comillas dobles y agregar comillas al valor
            const escaped = ('' + value).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(';')); 
    }

    // 3. Crear el archivo con BOM (para que Excel respete los acentos)
    const csvString = "\uFEFF" + csvRows.join('\n'); 
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // 4. Descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}