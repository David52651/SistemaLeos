import { supabase } from "@/lib/supabase";


/**
 * Genera el texto descriptivo del movimiento.
 */
function generarTextoMovimiento(tipo, cantidad, cambios = null) {
    switch (tipo) {
        case "Agregar":
            return `Se agregaron ${cantidad} artículos`;
        case "Desechar":
            return `Se desecharon ${cantidad} artículos`;
        case "Actualizar Stock":
            return `Se actualizó stock a ${cantidad} artículos`;
        case "Modificar Datos":
            if (cambios && Object.keys(cambios).length > 0) {
                const campos = Object.values(cambios).map((c) => c.label).join(", ");
                return `Se modificaron los datos: ${campos}`;
            }
            return "Se modificaron los datos del artículo";
        default:
            return "";
    }
}


/**
 * Registra un movimiento de stock (Agregar, Desechar, Actualizar Stock).
 */
export async function registrarMovimiento(data) {
    const textoMovimiento = generarTextoMovimiento(
        data.tipo_movimiento,
        data.cantidad
    );

    const { error } = await supabase.rpc("registrar_movimiento_inventario", {
        p_articulo_id: data.articulo_id,
        p_usuario_id: data.usuario_id,
        p_tipo_movimiento: data.tipo_movimiento,
        p_cantidad: data.cantidad,
        p_motivo: data.motivo,
        p_movimiento: textoMovimiento,
        p_detalles: data.detalles || null,
    });

    if (error) throw new Error(error.message);
    return true;
}


/**
 * Modifica los datos de un artículo y registra el movimiento de auditoría.
 */
export async function modificarArticuloConMovimiento(data) {
    const textoMovimiento = generarTextoMovimiento(
        "Modificar Datos",
        0,
        data.detalles?.cambios
    );

    const { error } = await supabase.rpc("modificar_articulo_con_movimiento", {
        p_articulo_id: data.articulo_id,
        p_usuario_id: data.usuario_id,
        p_nuevos_datos: data.nuevos_datos,
        p_motivo: data.motivo,
        p_movimiento: textoMovimiento,
        p_detalles: data.detalles,
    });

    if (error) throw new Error(error.message);
    return true;
}


/**
 * Obtiene el historial de movimientos con los datos del artículo y del usuario.
 */
export async function obtenerMovimientos() {

    // 1. Movimientos de inventario
    const { data: inventario, error: errorInv } = await supabase
        .from("movimientos_inventario")
        .select(`
            *,
            articulos ( codigo, nombre ),
            usuarios ( nombre_completo )
        `);

    if (errorInv) throw new Error(errorInv.message);

    // 2. Movimientos de catálogos
    const { data: catalogos, error: errorCat } = await supabase
        .from("movimientos_catalogos")
        .select(`
            *,
            usuarios ( nombre_completo )
        `);

    if (errorCat) throw new Error(errorCat.message);

    // 3. Normalizar catálogos al formato de inventario
    //    para que la tabla del frontend los muestre igual.
    const catalogosNormalizados = (catalogos || []).map((c) => ({
        id: c.id,
        fecha_movimiento: c.fecha_movimiento,
        tipo_movimiento: c.tipo_movimiento,
        cantidad: 0,
        motivo: c.motivo,
        movimiento: c.movimiento,
        detalles: c.detalles,
        usuario_id: c.usuario_id,
        // 👇 truco: mostramos "CATÁLOGO" como código y nombre ficticios
        articulos: { codigo: "CATÁLOGO", nombre: "Catálogo" },
        usuarios: c.usuarios,
        es_catalogo: true,
    }));

    // 4. Unificar y ordenar por fecha
    const todos = [...(inventario || []), ...catalogosNormalizados];

    todos.sort(
        (a, b) =>
            new Date(b.fecha_movimiento) - new Date(a.fecha_movimiento)
    );

    return todos;
}


/**
 * Obtiene la lista de artículos activos para el selector del formulario.
 */
export async function obtenerArticulosActivos() {
    const { data, error } = await supabase
        .from("articulos")
        .select("id, codigo, nombre, stock_actual")
        .eq("activo", true)
        .order("nombre", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

/* =====================================================
   MOVIMIENTOS DE CATÁLOGOS (NUEVO)
===================================================== */

export async function registrarMovimientoCatalogo(data) {
    // Mapeo para el texto: "categoria" → "Categorías", etc.
    const nombreCatalogo = {
        categoria: "Categorías",
        talla: "Tallas",
        propietario: "Propietarios",
        danza: "Danzas",
    }[data.entidad] || data.entidad;

    const textoMovimiento =
        `Se creó "${data.nombre_entidad}" en el catálogo de ${nombreCatalogo}`;

    const { error } = await supabase.rpc("registrar_movimiento_catalogo", {
        p_usuario_id: data.usuario_id,
        p_entidad: data.entidad,
        p_entidad_id: data.entidad_id,
        p_nombre_entidad: data.nombre_entidad,
        p_tipo_movimiento: data.accion || "Agregar",
        p_movimiento: textoMovimiento,
        p_motivo: data.motivo || "Creación de catálogo",
        p_detalles: data.detalles || null,
    });

    if (error) throw new Error(error.message);
    return true;
}