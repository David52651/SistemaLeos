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


/* =====================================================
   ARTÍCULOS
===================================================== */

export async function getArticulos() {
  const { data, error } = await supabase
    .from("articulos")
    .select(`
      *,
      categorias(nombre),
      tallas(nombre),
      propietarios(nombre),
      imagenes_articulo ( url_imagen, principal )
    `)
    .order("nombre");

  if (error) {
    throw error;
  }

  // Mapeamos los datos para que el frontend reciba "imagen_url" directo
  return data.map(articulo => ({
    ...articulo,
    imagen_url: articulo.imagenes_articulo?.find(img => img.principal)?.url_imagen 
             || articulo.imagenes_articulo?.[0]?.url_imagen 
             || null
  }));
}

export async function existeArticulo(values) {
  const { data, error } = await supabase
    .from("articulos")
    .select("id")
    .eq("nombre", values.nombre)
    .eq("categoria_id", values.categoria_id)
    .eq("talla_id", values.talla_id)
    .eq("propietario_id", values.propietario_id);

  if (error) {
    throw error;
  }

  return Boolean(data?.length);
}

export async function createArticulo(values) {
  const { data, error } = await supabase
    .from("articulos")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateArticulo(id, values) {
  const { error } = await supabase
    .from("articulos")
    .update(values)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function desactivarArticulo(id) {
  const { error } = await supabase
    .from("articulos")
    .update({ activo: false })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function activarArticulo(id) {
  const { error } = await supabase
    .from("articulos")
    .update({ activo: true })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/* =====================================================
   ARTÍCULO - DANZAS
===================================================== */

export async function guardarDanzasArticulo(articuloId, danzasIds) {
  const { error: deleteError } = await supabase
    .from("articulo_danza")
    .delete()
    .eq("articulo_id", articuloId);

  if (deleteError) {
    throw deleteError;
  }

  if (!danzasIds?.length) {
    return;
  }

  const registros = danzasIds.map(danzaId => ({
    articulo_id: articuloId,
    danza_id: danzaId,
  }));

  const { error } = await supabase
    .from("articulo_danza")
    .insert(registros);

  if (error) {
    throw error;
  }
}

/* =====================================================
   ARTÍCULO - IMÁGENES
===================================================== */

export async function guardarImagenArticulo(articuloId, urlImagen, esPrincipal = true) {
  const { error } = await supabase
    .from("imagenes_articulo")
    .insert({
      articulo_id: articuloId,
      url_imagen: urlImagen,
      principal: esPrincipal
    });

  if (error) {
    throw new Error("Error al guardar la imagen: " + error.message);
  }
}

/* =====================================================
   RPC: CREAR ARTÍCULO CON STOCK INICIAL
===================================================== */

export async function crearArticuloConStockInicial(payload, usuarioId) {
  const { data, error } = await supabase.rpc("crear_articulo_con_stock_inicial", {
    p_datos: payload,
    p_usuario_id: usuarioId,
  });

  if (error) {
    throw new Error(error.message);
  }

  // El RPC devuelve solo el UUID. Consultamos el artículo completo.
  // ⬅️ AQUÍ TAMBIÉN AGREGAMOS LA RELACIÓN DE IMÁGENES
  const { data: articulo, error: fetchError } = await supabase
    .from("articulos")
    .select(`
      *,
      categorias(nombre),
      tallas(nombre),
      propietarios(nombre),
      imagenes_articulo ( url_imagen, principal )
    `)
    .eq("id", data)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Mapeamos para devolver la propiedad imagen_url directa
  return {
    ...articulo,
    imagen_url: articulo.imagenes_articulo?.find(img => img.principal)?.url_imagen 
             || articulo.imagenes_articulo?.[0]?.url_imagen 
             || null
  };
}

/* =====================================================
   HOOK: CATÁLOGOS DE INVENTARIO
===================================================== */

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