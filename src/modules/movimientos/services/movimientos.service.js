import { supabase } from "@/lib/supabase";

/**
 * Llama a la función RPC en Supabase para registrar un movimiento de inventario.
 * @param {Object} data - Datos del movimiento.
 * @param {string} data.articulo_id - UUID del artículo.
 * @param {string} data.usuario_id - UUID del usuario (de la tabla usuarios, no auth).
 * @param {string} data.tipo_movimiento - 'Agregar', 'Desechar', 'Actualizar Stock', 'Modificar Datos'.
 * @param {number} data.cantidad - Cantidad (o nuevo stock si es actualización).
 * @param {string} data.motivo - Razón del movimiento.
 * @param {Object} [data.detalles] - JSON opcional para 'Modificar Datos'.
 */
export async function registrarMovimiento(data) {
    const { error } = await supabase.rpc("registrar_movimiento_inventario", {
    p_articulo_id: data.articulo_id,
    p_usuario_id: data.usuario_id,
    p_tipo_movimiento: data.tipo_movimiento,
    p_cantidad: data.cantidad,
    p_motivo: data.motivo,
    p_detalles: data.detalles || null,
});

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

/**
 * Obtiene el historial de movimientos con los datos del artículo y del usuario.
 */
export async function obtenerMovimientos() {
    const { data, error } = await supabase
        .from("movimientos_inventario")
        .select(`
            *,
            articulos ( codigo, nombre ),
            usuarios ( nombre_completo )
        `)
        .order("fecha_movimiento", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
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

    if (error) {
        throw new Error(error.message);
    }

    return data;
}