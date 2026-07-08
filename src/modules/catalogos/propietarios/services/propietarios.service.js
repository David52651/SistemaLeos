import { supabase } from "@/lib/supabase";

export async function getPropietarios() {

  const { data, error } =
    await supabase
      .from("propietarios")
      .select("*")
      .order("nombre");

  if (error) throw error;

  return data;
}

export async function createPropietario(values) {

  console.log("VALUES:", values);

  const { data, error } =
    await supabase
      .from("propietarios")
      .insert(values)
      .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePropietario(
  id,
  values
) {

  const { error } =
    await supabase
      .from("propietarios")
      .update(values)
      .eq("id", id);

  if (error) throw error;
}

export async function desactivarPropietario(
  id
) {

  const { error } =
    await supabase
      .from("propietarios")
      .update({
        activo: false,
      })
      .eq("id", id);

  if (error) throw error;
}

export async function activarPropietario(
  id
) {

  const { error } =
    await supabase
      .from("propietarios")
      .update({
        activo: true,
      })
      .eq("id", id);

  if (error) throw error;
}