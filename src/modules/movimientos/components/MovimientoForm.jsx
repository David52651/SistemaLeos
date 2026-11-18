import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Select from "react-select"; 

import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/Select"; 
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import CatalogoModal from "@/modules/inventario/components/CatalogoModal";
import ArticuloForm from "@/modules/inventario/components/ArticuloForm";
import ArticuloModal from "@/modules/inventario/components/modals/ArticuloModal";

import { useAuth } from "@/contexts/AuthContext";
import { useCatalogosInventario } from "@/modules/inventario/hooks/useCatalogosInventario";
import { supabase } from "@/lib/supabase";

import { generarCodigoArticulo } from "@/modules/inventario/utils/generarCodigoArticulo";
import {
    guardarDanzasArticulo,
    existeArticulo,
    crearArticuloConStockInicial,  
    guardarImagenArticulo,
} from "@/modules/inventario/services/inventario.service";

import { createCategoria } from "@/modules/catalogos/categorias/services/categorias.service";
import { createTalla } from "@/modules/catalogos/tallas/services/tallas.service";
import { createPropietario } from "@/modules/catalogos/propietarios/services/propietarios.service";
import { createDanza } from "@/modules/catalogos/danzas/services/danzas.service";

import { movimientoSchema } from "../schemas/movimientos.schema";
import { useMovimientos } from "../hooks/useMovimientos";
import { TIPOS_MOVIMIENTO } from "../constants/tiposMovimiento";
import { modificarArticuloConMovimiento, registrarMovimientoCatalogo } from "../services/movimientos.service";

export default function MovimientoForm({ onSuccess }) {
  const { perfil } = useAuth();
  const queryClient = useQueryClient();
  const { articulos, registrar, isRegistrando } = useMovimientos();
  const { categorias, tallas, propietarios, danzas } = useCatalogosInventario();

  // Modales
  const [modalNuevoArticulo, setModalNuevoArticulo] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalTalla, setModalTalla] = useState(false);
  const [modalPropietario, setModalPropietario] = useState(false);
  const [modalDanza, setModalDanza] = useState(false);

  // ⬅️ NUEVOS ESTADOS PARA EL BUSCADOR
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");

  // Formulario principal
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(movimientoSchema),
    defaultValues: {
      articulo_id: "",
      tipo_movimiento: "Agregar",
      cantidad: 0,
      motivo: "",
      nombre: "",
      descripcion: "",
      categoria_id: "",
      talla_id: "",
      propietario_id: "",
      genero: "unisex",
      stock_min: 3,
      observaciones: "",
    },
  });

  const tipoMovimiento = watch("tipo_movimiento");
  const articuloId = watch("articulo_id");
  const articuloSeleccionado = articulos.find((a) => a.id === articuloId);

  const esModificarDatos = tipoMovimiento === "Modificar Datos";
  const esActualizarStock = tipoMovimiento === "Actualizar Stock";

  // ⬅️ 1. AGRUPAR MODELOS ÚNICOS PARA EL BUSCADOR
  const opcionesModelos = useMemo(() => {
    const modelos = new Set();
    articulos.forEach(a => modelos.add(a.nombre));
    return Array.from(modelos).sort().map(nombre => ({ value: nombre, label: nombre }));
  }, [articulos]);

  // ⬅️ 2. FILTRAR TALLAS DEL MODELO SELECCIONADO
  const opcionesTallas = useMemo(() => {
    if (!modeloSeleccionado) return [];
    return articulos
      .filter(a => a.nombre === modeloSeleccionado)
      .map(a => ({
        value: a.id,
        label: `Talla ${a.tallas?.nombre || "Única"} (Stock: ${a.stock_actual})`
      }));
  }, [modeloSeleccionado, articulos]);

  useEffect(() => {
    if (esModificarDatos && articuloSeleccionado) {
      setValue("nombre", articuloSeleccionado.nombre || "");
      setValue("descripcion", articuloSeleccionado.descripcion || "");
      setValue("categoria_id", articuloSeleccionado.categoria_id || "");
      setValue("talla_id", articuloSeleccionado.talla_id || "");
      setValue("propietario_id", articuloSeleccionado.propietario_id || "");
      setValue("genero", articuloSeleccionado.genero || "unisex");
      setValue("stock_min", articuloSeleccionado.stock_min || 3);
      setValue("observaciones", articuloSeleccionado.observaciones || "");
      
      // Sincronizar los selectores visuales si estamos editando
      setModeloSeleccionado(articuloSeleccionado.nombre);
      setTallaSeleccionada(articuloSeleccionado.id);
    }
  }, [articuloSeleccionado, esModificarDatos, setValue]);

  // ============================================
  // CREAR ARTÍCULO (con subida de imagen)
  // ============================================
  async function handleCrearArticulo(values, imagenFile) {
    try {
        if (!perfil?.id) {
            toast.error("No se encontró el perfil del usuario.");
            return;
        }

        const duplicado = await existeArticulo(values);
        if (duplicado) {
            toast.error("Ya existe un artículo con esas características");
            return;
        }

        let imagen_url = null;
        if (imagenFile) {
            const fileExt = imagenFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('articulos')
                .upload(filePath, imagenFile);

            if (uploadError) throw new Error("Error al subir la imagen: " + uploadError.message);

            const { data: publicUrlData } = supabase.storage
                .from('articulos')
                .getPublicUrl(filePath);

            imagen_url = publicUrlData.publicUrl;
        }

        const tallaSel = tallas.data?.find((t) => t.id === values.talla_id);
        const codigo = generarCodigoArticulo(values.nombre, tallaSel?.nombre);
        const { danzas_ids: _danzas_ids, ...restoValores } = values;
        
        const payload = { ...restoValores, codigo };
        const articuloGuardado = await crearArticuloConStockInicial(payload, perfil.id);

        await guardarDanzasArticulo(articuloGuardado.id, values.danzas_ids || []);

        if (imagen_url) {
            await guardarImagenArticulo(articuloGuardado.id, imagen_url, true);
        }

        toast.success("Artículo creado correctamente");

        queryClient.setQueryData(["articulos-selector"], (old = []) => {
            const nuevo = {
                id: articuloGuardado.id,
                codigo: articuloGuardado.codigo,
                nombre: articuloGuardado.nombre,
                stock_actual: articuloGuardado.stock_actual,
                imagen_url: imagen_url,
            };
            return [...old, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre));
        });

        queryClient.invalidateQueries({ queryKey: ["movimientos"] });
        queryClient.invalidateQueries({ queryKey: ["articulos"] });

        // Autoseleccionar el artículo recién creado
        setValue("articulo_id", articuloGuardado.id);
        setModeloSeleccionado(articuloGuardado.nombre);
        setTallaSeleccionada(articuloGuardado.id);

        setModalNuevoArticulo(false);
    } catch (error) {
        toast.error(error.message);
    }
  }

  // ============================================
  // CREAR CATÁLOGOS
  // ============================================
  async function crearCategoria(values) {
    try {
      const nueva = await createCategoria(values);
      await registrarMovimientoCatalogo({
          usuario_id: perfil.id,
          entidad: "categoria",
          entidad_id: nueva.id,
          nombre_entidad: nueva.nombre,
          accion: "Agregar",
      });
      toast.success("Categoría creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["categorias-activo"] });
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      setModalCategoria(false);
    } catch (error) { toast.error(error.message); }
  }

  async function crearTalla(values) {
    try {
      const nueva = await createTalla(values);
      await registrarMovimientoCatalogo({
          usuario_id: perfil.id,
          entidad: "talla",
          entidad_id: nueva.id,
          nombre_entidad: nueva.nombre,
          accion: "Agregar",
      });
      toast.success("Talla creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["tallas-activo"] });
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      setModalTalla(false);
    } catch (error) { toast.error(error.message); }
  }

  async function crearPropietario(values) {
    try {
      const nuevo = await createPropietario(values);
      await registrarMovimientoCatalogo({
          usuario_id: perfil.id,
          entidad: "propietario",
          entidad_id: nuevo.id,
          nombre_entidad: nuevo.nombre,
          accion: "Agregar",
      });
      toast.success("Propietario creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["propietarios-activo"] });
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      setModalPropietario(false);
    } catch (error) { toast.error(error.message); }
  }

  async function crearDanza(values) {
    try {
      const nueva = await createDanza(values);
      await registrarMovimientoCatalogo({
          usuario_id: perfil.id,
          entidad: "danza",
          entidad_id: nueva.id,
          nombre_entidad: nueva.nombre,
          accion: "Agregar",
      });
      toast.success("Danza creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["danzas"] });
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      setModalDanza(false);
    } catch (error) { toast.error(error.message); }
  }

  // ============================================
  // CONSTRUIR DETALLES DE AUDITORÍA (diff)
  // ============================================
  function construirDetallesCambios(data) {
    const campos = [
      { key: "nombre", label: "Nombre" },
      { key: "descripcion", label: "Descripción" },
      { key: "categoria_id", label: "Categoría" },
      { key: "talla_id", label: "Talla" },
      { key: "propietario_id", label: "Propietario" },
      { key: "genero", label: "Género" },
      { key: "stock_min", label: "Stock Mínimo" },
      { key: "observaciones", label: "Observaciones" },
    ];

    const cambios = {};

    campos.forEach(({ key, label }) => {
      const antes = articuloSeleccionado?.[key];
      const despues = data[key];
      if (String(antes ?? "") !== String(despues ?? "")) {
        cambios[key] = { label, antes, despues };
      }
    });

    return cambios;
  }

  // ============================================
  // SUBMIT DEL FORMULARIO
  // ============================================
  async function onSubmit(data) {
    if (!perfil?.id) {
      toast.error("No se encontró el perfil del usuario.");
      return;
    }

    try {
      if (esModificarDatos) {
        const cambios = construirDetallesCambios(data);

        if (Object.keys(cambios).length === 0) {
          toast.info("No se detectaron cambios en el artículo");
          return;
        }

        await modificarArticuloConMovimiento({
          articulo_id: data.articulo_id,
          usuario_id: perfil.id,
          nuevos_datos: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            categoria_id: data.categoria_id,
            talla_id: data.talla_id,
            propietario_id: data.propietario_id,
            genero: data.genero,
            stock_min: Number(data.stock_min),
            observaciones: data.observaciones,
          },
          motivo: data.motivo,
          movimiento: `Se modificaron los datos: ${Object.values(cambios).map((c) => c.label).join(", ")}`,
          detalles: { cambios },
        });

        toast.success("Artículo modificado y movimiento registrado");
        reset();
        queryClient.invalidateQueries({ queryKey: ["articulos-selector"] });
        queryClient.invalidateQueries({ queryKey: ["movimientos"] });
        queryClient.invalidateQueries({ queryKey: ["articulos"] });
        if (onSuccess) onSuccess();
        return;
      }

      await registrar({
        articulo_id: data.articulo_id,
        usuario_id: perfil.id,
        tipo_movimiento: data.tipo_movimiento,
        cantidad: Number(data.cantidad),
        motivo: data.motivo,
        detalles: null,
      });

      toast.success("Movimiento registrado correctamente");
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        
        {/* FILA 1: Selector de Artículo doble (Prenda -> Talla) */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", marginBottom: "1rem" }}>
          
          <div style={{ flex: 2 }}>
            <label className="form-label required">1. Buscar Prenda</label>
            <Select
              options={opcionesModelos}
              value={opcionesModelos.find(o => o.value === modeloSeleccionado) || null}
              onChange={(opcion) => {
                setModeloSeleccionado(opcion ? opcion.value : "");
                setTallaSeleccionada("");
                setValue("articulo_id", ""); 
              }}
              placeholder="Escribe el nombre de la prenda..."
              isClearable
              isSearchable
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({ ...base, background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-primary)", minHeight: "42px" }),
                menu: (base) => ({ ...base, background: "var(--bg-card)", zIndex: 9999 }),
                option: (base, state) => ({ ...base, background: state.isFocused ? "var(--bg-hover)" : "transparent", color: "var(--text-primary)", cursor: "pointer" }),
                singleValue: (base) => ({ ...base, color: "var(--text-primary)" }),
                input: (base) => ({ ...base, color: "var(--text-primary)" })
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label required">2. Talla</label>
            <Select
              options={opcionesTallas}
              value={opcionesTallas.find(o => o.value === tallaSeleccionada) || null}
              onChange={(opcion) => {
                setTallaSeleccionada(opcion ? opcion.value : "");
                setValue("articulo_id", opcion ? opcion.value : "", { shouldValidate: true });
              }}
              placeholder={modeloSeleccionado ? "Selecciona talla..." : "Elige prenda primero"}
              isDisabled={!modeloSeleccionado}
              isClearable
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({ ...base, background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-primary)", minHeight: "42px" }),
                menu: (base) => ({ ...base, background: "var(--bg-card)", zIndex: 9999 }),
                option: (base, state) => ({ ...base, background: state.isFocused ? "var(--bg-hover)" : "transparent", color: "var(--text-primary)", cursor: "pointer" }),
                singleValue: (base) => ({ ...base, color: "var(--text-primary)" }),
                input: (base) => ({ ...base, color: "var(--text-primary)" })
              }}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setModalNuevoArticulo(true)}
            style={{ height: "42px", marginBottom: "12px" }}
          >
            + Nuevo artículo
          </Button>
        </div>

        {/* Info Box de Stock */}
        {articuloSeleccionado && !esModificarDatos && (
          <div style={{
              padding: "8px 12px",
              background: "var(--bg-secondary, #f3f4f6)",
              borderRadius: "6px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1rem"
          }}>
            {articuloSeleccionado.imagen_url && (
              <img src={articuloSeleccionado.imagen_url} alt="mini" style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "4px" }} />
            )}
            <span>
              Stock actual de <strong>{articuloSeleccionado.nombre} (Talla {articuloSeleccionado.tallas?.nombre})</strong>:{" "}
              <strong>{articuloSeleccionado.stock_actual}</strong> unidades
            </span>
          </div>
        )}

        {/* FILA 2: Tipo y Cantidad (en dos columnas) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <CustomSelect
            label="Tipo de Movimiento"
            required
            {...register("tipo_movimiento")}
            error={errors.tipo_movimiento?.message}
          >
            {TIPOS_MOVIMIENTO.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </CustomSelect>

          {!esModificarDatos && (
            <Input
              label={esActualizarStock ? "Nuevo stock exacto" : "Cantidad"}
              type="number"
              placeholder="0"
              {...register("cantidad")}
              error={errors.cantidad?.message}
              required
            />
          )}
        </div>

        {/* BLOQUE A: MODIFICAR DATOS (form completo) */}
        {esModificarDatos && articuloSeleccionado && (
          <Card>
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Datos del artículo</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <Input label="Nombre del artículo" {...register("nombre")} error={errors.nombre?.message} required />
                <Input label="Género" {...register("genero")} error={errors.genero?.message} />
            </div>

            <Input label="Descripción" as="textarea" {...register("descripcion")} style={{ marginBottom: "1rem" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <CustomSelect label="Categoría" {...register("categoria_id")}>
                  <option value="">Seleccione</option>
                  {categorias.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </CustomSelect>
                <CustomSelect label="Talla" {...register("talla_id")}>
                  <option value="">Seleccione</option>
                  {tallas.data?.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </CustomSelect>
                <CustomSelect label="Propietario" {...register("propietario_id")}>
                  <option value="">Seleccione</option>
                  {propietarios.data?.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </CustomSelect>
            </div>

            <Input label="Stock mínimo" type="number" min="0" {...register("stock_min", { valueAsNumber: true })} style={{ marginBottom: "1rem" }} />
            <Input label="Observaciones" as="textarea" {...register("observaciones")} />
          </Card>
        )}

        {esModificarDatos && !articuloSeleccionado && (
          <div className="info-box" style={{ padding: "12px", background: "var(--bg-secondary, #f3f4f6)", borderRadius: "6px", fontSize: "14px", opacity: 0.75 }}>
            Selecciona un artículo para ver y modificar sus datos.
          </div>
        )}

        {/* FILA 3: Motivo (ancho completo) */}
        <Input
          label="Motivo del movimiento"
          placeholder="Ej: Compra a proveedor, Conteo físico, Prenda dañada..."
          {...register("motivo")}
          error={errors.motivo?.message}
          required
        />

        {/* FILA 4: Botón */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button type="submit" variant="primary" disabled={isRegistrando} loading={isRegistrando}>
            {esModificarDatos ? "Guardar Cambios" : "Registrar Movimiento"}
          </Button>
        </div>
      </form>

      {/* MODAL: Crear nuevo artículo */}
      <CatalogoModal
        open={modalNuevoArticulo}
        title="Nuevo artículo"
        onClose={() => setModalNuevoArticulo(false)}
        size="lg"
      >
        <ArticuloForm
          onSubmit={handleCrearArticulo}
          hideToggleButton
          onOpenCategoria={() => setModalCategoria(true)}
          onOpenTalla={() => setModalTalla(true)}
          onOpenPropietario={() => setModalPropietario(true)}
          onOpenDanza={() => setModalDanza(true)}
        />
      </CatalogoModal>

      {/* MODALES: Catálogos */}
      <ArticuloModal
        modalCategoria={modalCategoria}
        setModalCategoria={setModalCategoria}
        modalTalla={modalTalla}
        setModalTalla={setModalTalla}
        modalPropietario={modalPropietario}
        setModalPropietario={setModalPropietario}
        modalDanza={modalDanza}
        setModalDanza={setModalDanza}
        crearCategoria={crearCategoria}
        crearTalla={crearTalla}
        crearPropietario={crearPropietario}
        crearDanza={crearDanza}
      />
    </>
  );
}