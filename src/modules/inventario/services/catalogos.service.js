import { supabase } from "@/lib/supabase";

export async function getCategoriasActivas() {

  const { data, error } =
    await supabase
      .from("categorias")
      .select("id,nombre")
      .eq("activo", true)
      .order("nombre");

  if (error) throw error;

  return data;
}

export async function getTallasActivas() {

  const { data, error } =
    await supabase
      .from("tallas")
      .select("id,nombre")
      .eq("activo", true)
      .order("nombre");

  if (error) throw error;

  return data;
}

export async function getPropietariosActivos() {

  const { data, error } =
    await supabase
      .from("propietarios")
      .select("id,nombre,tipo")
      .eq("activo", true)
      .order("nombre");

  if (error) throw error;

  return data;
}