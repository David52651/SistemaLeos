import { supabase } from "@/lib/supabase";

export async function getDanzas() {

  const { data, error } =
    await supabase
      .from("danzas")
      .select("*")
      .order("nombre");

  if (error) throw error;

  return data;
}

export async function createDanza(values) {

  const { error } =
    await supabase
      .from("danzas")
      .insert(values);

  if (error) throw error;
}

export async function updateDanza(
  id,
  values
) {

  const { error } =
    await supabase
      .from("danzas")
      .update(values)
      .eq("id", id);

  if (error) throw error;
}

export async function desactivarDanza(
  id
) {

  const { error } =
    await supabase
      .from("danzas")
      .update({
        activo: false,
      })
      .eq("id", id);

  if (error) throw error;
}

export async function activarDanza(
  id
) {

  const { error } =
    await supabase
      .from("danzas")
      .update({
        activo: true,
      })
      .eq("id", id);

  if (error) throw error;
}