import { supabase } from "@/lib/supabase";

/* =====================================================
   SISTEMA LEOS
   Servicio de Danzas
===================================================== */

const TABLA = "danzas";

/* =====================================================
   OBTENER TODAS LAS DANZAS
===================================================== */

export async function getDanzas() {

    const { data, error } = await supabase
        .from(TABLA)
        .select("*")
        .order("nombre", { ascending: true });

    if (error) {

        throw new Error(
            "No se pudieron obtener las danzas."
        );

    }

    return data;

}

/* =====================================================
   CREAR DANZA
===================================================== */

export async function createDanza(values) {

    const { data, error } = await supabase
        .from(TABLA)
        .insert(values)
        .select()
        .single();

    if (error) {

        throw new Error(
            "No se pudo crear la danza."
        );

    }

    return data;

}

/* =====================================================
   ACTUALIZAR DANZA
===================================================== */

export async function updateDanza(id, values) {

    const { data, error } = await supabase
        .from(TABLA)
        .update(values)
        .eq("id", id)
        .select()
        .single();

    if (error) {

        throw new Error(
            "No se pudo actualizar la danza."
        );

    }

    return data;

}

/* =====================================================
   DESACTIVAR DANZA
===================================================== */

export async function desactivarDanza(id) {

    const { data, error } = await supabase
        .from(TABLA)
        .update({
            activo: false,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {

        throw new Error(
            "No se pudo desactivar la danza."
        );

    }

    return data;

}

/* =====================================================
   ACTIVAR DANZA
===================================================== */

export async function activarDanza(id) {

    const { data, error } = await supabase
        .from(TABLA)
        .update({
            activo: true,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {

        throw new Error(
            "No se pudo activar la danza."
        );

    }

    return data;

}