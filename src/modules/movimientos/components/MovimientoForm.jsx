import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
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
    createArticulo,
    guardarDanzasArticulo,
    existeArticulo,
    crearArticuloConStockInicial,  
} from "@/modules/inventario/services/inventario.service";

import { createCategoria } from "@/modules/catalogos/categorias/services/categorias.service";
import { createTalla } from "@/modules/catalogos/tallas/services/tallas.service";
import { createPropietario } from "@/modules/catalogos/propietarios/services/propietarios.service";
import { createDanza } from "@/modules/catalogos/danzas/services/danzas.service";

import { movimientoSchema } from "../schemas/movimientos.schema";
import { useMovimientos } from "../hooks/useMovimientos";
import { TIPOS_MOVIMIENTO } from "../constants/tiposMovimiento";
import { modificarArticuloConMovimiento } from "../services/movimientos.service";
import { registrarMovimientoCatalogo } from "../services/movimientos.service";

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
      // Campos de "Modificar Datos"
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

  // Cuando cambia el artículo seleccionado, precargamos sus datos en el form
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
    }
  }, [articuloSeleccionado, esModificarDatos, setValue]);

  // ============================================
  // CREAR ARTÍCULO (desde el modal)
  // ============================================
  async function handleCrearArticulo(values) {
    try {
        if (!perfil?.id) {
            toast.error("No se encontró el perfil del usuario. Vuelve a iniciar sesión.");
            return;
        }

        const duplicado = await existeArticulo(values);
        if (duplicado) {
            toast.error("Ya existe un artículo con esas características");
            return;
        }

        const tallaSeleccionada = tallas.data?.find(
            (t) => t.id === values.talla_id
        );

        const codigo = generarCodigoArticulo(
            values.nombre,
            tallaSeleccionada?.nombre
        );

        const { danzas_ids: _danzas_ids, ...restoValores } = values;
        const payload = { ...restoValores, codigo };

        // ⬅️ NUEVO: usa la RPC atómica con stock inicial
        const articuloGuardado = await crearArticuloConStockInicial(
            payload,
            perfil.id
        );

        // Guardar danzas asociadas
        await guardarDanzasArticulo(
            articuloGuardado.id,
            values.danzas_ids || []
        );

        toast.success("Artículo creado correctamente");

        // Actualizar el caché para que aparezca en el selector
        queryClient.setQueryData(["articulos-selector"], (old = []) => {
            const nuevo = {
                id: articuloGuardado.id,
                codigo: articuloGuardado.codigo,
                nombre: articuloGuardado.nombre,
                stock_actual: articuloGuardado.stock_actual,
            };
            return [...old, nuevo].sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );
        });

        // Invalidate queries para refrescar tablas
        queryClient.invalidateQueries({ queryKey: ["movimientos"] });
        queryClient.invalidateQueries({ queryKey: ["articulos"] });

        setValue("articulo_id", articuloGuardado.id);
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
    } catch (error) {
        toast.error(error.message);
    }
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
    } catch (error) {
        toast.error(error.message);
    }
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
    } catch (error) {
        toast.error(error.message);
    }
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
    } catch (error) {
        toast.error(error.message);
    }
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
      // Comparamos como strings para evitar falsos positivos (ej: 3 vs "3")
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
      toast.error(
        "No se encontró el perfil del usuario. Vuelve a iniciar sesión.",
      );
      return;
    }

    try {
      // --------------------------------------------------
      // CASO 1: MODIFICAR DATOS (usa la nueva RPC)
      // --------------------------------------------------
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
          movimiento: `Se modificaron los datos: ${Object.values(cambios)
            .map((c) => c.label)
            .join(", ")}`,
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

      // --------------------------------------------------
      // CASO 2: MOVIMIENTOS DE STOCK (RPC original)
      // --------------------------------------------------
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
        {/* 1. Selector de Artículo + Botón Nuevo */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <Select
              label="Artículo"
              required
              {...register("articulo_id")}
              error={errors.articulo_id?.message}
            >
              <option value="">Seleccione un artículo</option>
              {articulos.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.codigo} - {art.nombre} (Stock: {art.stock_actual})
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setModalNuevoArticulo(true)}
            style={{ marginBottom: "12px" }}
          >
            + Nuevo artículo
          </Button>
        </div>

        {articuloSeleccionado && !esModificarDatos && (
          <div
            className="info-box"
            style={{
              padding: "8px 12px",
              background: "var(--bg-secondary, #f3f4f6)",
              borderRadius: "6px",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            Stock actual de <strong>{articuloSeleccionado.nombre}</strong>:{" "}
            <strong>{articuloSeleccionado.stock_actual}</strong> unidades
          </div>
        )}

        {/* 2. Tipo de Movimiento */}
        <Select
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
        </Select>

        {/* ============================================
                    BLOQUE A: MODIFICAR DATOS (form completo)
                ============================================ */}
        {esModificarDatos && articuloSeleccionado && (
          <Card>
            <h3>Datos del artículo</h3>

            <Input
              label="Nombre del artículo"
              {...register("nombre")}
              error={errors.nombre?.message}
              required
            />

            <Input
              label="Descripción"
              as="textarea"
              {...register("descripcion")}
            />

            <Select label="Categoría" {...register("categoria_id")}>
              <option value="">Seleccione</option>
              {categorias.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </Select>

            <Select label="Talla" {...register("talla_id")}>
              <option value="">Seleccione</option>
              {tallas.data?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </Select>

            <Select label="Propietario" {...register("propietario_id")}>
              <option value="">Seleccione</option>
              {propietarios.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </Select>

            <Select label="Género" {...register("genero")}>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="unisex">Unisex</option>
            </Select>

            <Input
              label="Stock mínimo"
              type="number"
              min="0"
              {...register("stock_min", { valueAsNumber: true })}
            />

            <Input
              label="Observaciones"
              as="textarea"
              {...register("observaciones")}
            />
          </Card>
        )}

        {esModificarDatos && !articuloSeleccionado && (
          <div
            className="info-box"
            style={{
              padding: "12px",
              background: "var(--bg-secondary, #f3f4f6)",
              borderRadius: "6px",
              marginBottom: "12px",
              fontSize: "14px",
              opacity: 0.75,
            }}
          >
            Selecciona un artículo para ver y modificar sus datos.
          </div>
        )}

        {/* ============================================
                    BLOQUE B: MOVIMIENTOS DE STOCK (cantidad)
                ============================================ */}
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

        {/* 3. Motivo (siempre visible) */}
        <Input
          label="Motivo"
          placeholder="Ej: Compra a proveedor, Conteo físico, Prenda dañada..."
          {...register("motivo")}
          error={errors.motivo?.message}
          required
        />

        {/* 4. Botón */}
        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isRegistrando}
            loading={isRegistrando}
          >
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
