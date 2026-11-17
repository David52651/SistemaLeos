import { supabase } from "@/lib/supabase";

export async function crearAlquiler(data) {
    const { data: id, error } = await supabase.rpc("crear_alquiler", {
        p_usuario_id: data.usuario_id,
        p_cliente_nombre: data.cliente_nombre,
        p_cliente_dni: data.cliente_dni,
        p_cliente_contacto: data.cliente_contacto,
        p_cliente_direccion: data.cliente_direccion,
        p_tipo: data.tipo,
        p_fecha_devolucion_pactada: data.fecha_devolucion_pactada,
        p_observaciones: data.observaciones,
        p_detalles: data.detalles
    });

    if (error) throw new Error(error.message);
    return id;
}

export async function devolverAlquiler(alquilerId, usuarioId, detallesDevolucion) {
    const { error } = await supabase.rpc("devolver_alquiler", {
        p_alquiler_id: alquilerId,
        p_usuario_id: usuarioId,
        p_detalles_devolucion: detallesDevolucion
    });

    if (error) throw new Error(error.message);
    return true;
}

export async function obtenerAlquileres() {
    const { data, error } = await supabase
        .from("alquileres")
        .select(`
            *,
            usuarios ( nombre_completo ),
            alquiler_detalles (
                id,
                cantidad,
                observacion_salida,
                observacion_devolucion,
                articulos ( nombre, codigo, tallas(nombre) )
            )
        `)
        .order("fecha_salida", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}