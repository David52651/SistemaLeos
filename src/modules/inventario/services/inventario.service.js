import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

import {
  getCategoriasActivas,
  getTallasActivas,
  getPropietariosActivos,
} from "../services/catalogos.service";

import {
  getDanzas,
} from "@/modules/catalogos/danzas/services/danzas.service";


export async function getArticulos() {

  const { data, error } =
    await supabase
      .from("articulos")
      .select(`
        *,
        categorias(nombre),
        tallas(nombre),
        propietarios(nombre)
      `)
      .order("nombre");

  if (error) {
    throw error;
  }

  return data;
}

export async function existeArticulo(
  values
) {

  const { data, error } =
    await supabase
      .from("articulos")
      .select("id")
      .eq(
        "nombre",
        values.nombre
      )
      .eq(
        "categoria_id",
        values.categoria_id
      )
      .eq(
        "talla_id",
        values.talla_id
      )
      .eq(
        "propietario_id",
        values.propietario_id
      );

  if (error) {
    throw error;
  }

  return Boolean(data?.length);
}

export async function guardarDanzasArticulo(
  articuloId,
  danzasIds
) {

  const { error: deleteError } =
    await supabase
      .from("articulo_danza")
      .delete()
      .eq(
        "articulo_id",
        articuloId
      );

  if (deleteError) {
    throw deleteError;
  }

  if (!danzasIds?.length) {
    return;
  }

  const registros =
    danzasIds.map(
      danzaId => ({
        articulo_id: articuloId,
        danza_id: danzaId,
      })
    );

  const { error } =
    await supabase
      .from("articulo_danza")
      .insert(registros);

  if (error) {
    throw error;
  }

}


export async function createArticulo(
  values
) {

  const { data, error } =
    await supabase
      .from("articulos")
      .insert(values)
      .select()
      .single();

       console.log("VALUES:", values);
  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

  return data;

}

export async function updateArticulo(
  id,
  values
) {

  const { error } =
    await supabase
      .from("articulos")
      .update(values)
      .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function desactivarArticulo(
  id
) {

  const { error } =
    await supabase
      .from("articulos")
      .update({
        activo: false,
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function activarArticulo(
  id
) {

  const { error } =
    await supabase
      .from("articulos")
      .update({
        activo: true,
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}

export function useCatalogosInventario() {

  const categorias = useQuery({
    queryKey: ["categorias-activo"],
    queryFn: getCategoriasActivas,
  });

  const tallas = useQuery({
    queryKey: ["tallas-activo"],
    queryFn: getTallasActivas,
  });

  const propietarios = useQuery({
    queryKey: ["propietarios-activo"],
    queryFn: getPropietariosActivos,
  });

  const danzas = useQuery({
    queryKey: ["danzas"],
    queryFn: getDanzas,
  });

  return {
    categorias,
    tallas,
    propietarios,
    danzas,
  };
}