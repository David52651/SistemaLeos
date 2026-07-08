import { supabase } from "@/lib/supabase";

export async function getCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");

  if (error) throw error;

  return data;
}

export async function createCategoria(categoria) {
  const { data, error } = await supabase
    .from("categorias")
    .insert([categoria])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCategoria(id, values) {

  const { data, error } = await supabase
    .from("categorias")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function desactivarCategoria(id) {

  const { error } = await supabase
    .from("categorias")
    .update({
      activo: false
    })
    .eq("id", id);

  if (error) throw error;
}

export async function activarCategoria(id) {

  const { error } = await supabase
    .from("categorias")
    .update({
      activo: true,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}