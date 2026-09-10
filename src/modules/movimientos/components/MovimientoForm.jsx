import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

import CatalogoModal from "@/modules/inventario/components/CatalogoModal";
import ArticuloForm from "@/modules/inventario/components/ArticuloForm";
import ArticuloModal from "@/modules/inventario/components/modals/ArticuloModal";

import { useAuth } from "@/contexts/AuthContext";
import { useCatalogosInventario } from "@/modules/inventario/hooks/useCatalogosInventario";

import { generarCodigoArticulo } from "@/modules/inventario/utils/generarCodigoArticulo";
import {
    createArticulo,
    guardarDanzasArticulo,
    existeArticulo,
} from "@/modules/inventario/services/inventario.service";

import { createCategoria } from "@/modules/catalogos/categorias/services/categorias.service";
import { createTalla } from "@/modules/catalogos/tallas/services/tallas.service";
import { createPropietario } from "@/modules/catalogos/propietarios/services/propietarios.service";
import { createDanza } from "@/modules/catalogos/danzas/services/danzas.service";

import { movimientoSchema } from "../schemas/movimientos.schema";
import { useMovimientos } from "../hooks/useMovimientos";
import { TIPOS_MOVIMIENTO } from "../constants/tiposMovimiento";


export default function MovimientoForm({ onSuccess }) {
    const { perfil } = useAuth();
    const queryClient = useQueryClient();
    const { articulos, registrar, isRegistrando } = useMovimientos();
    const { tallas } = useCatalogosInventario();

    // Estados de los modales
    const [modalNuevoArticulo, setModalNuevoArticulo] = useState(false);
    const [modalCategoria, setModalCategoria] = useState(false);
    const [modalTalla, setModalTalla] = useState(false);
    const [modalPropietario, setModalPropietario] = useState(false);
    const [modalDanza, setModalDanza] = useState(false);

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
            nuevo_nombre: "",
        },
    });

    const tipoMovimiento = watch("tipo_movimiento");
    const articuloId = watch("articulo_id");
    const articuloSeleccionado = articulos.find((a) => a.id === articuloId);

    const esModificarDatos = tipoMovimiento === "Modificar Datos";
    const esActualizarStock = tipoMovimiento === "Actualizar Stock";

    // ============================================
    // CREAR ARTÍCULO DESDE EL MODAL
    // ============================================
    async function handleCrearArticulo(values) {
        try {
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

            const articuloGuardado = await createArticulo(payload);
            await guardarDanzasArticulo(
                articuloGuardado.id,
                values.danzas_ids || []
            );

            toast.success("Artículo creado correctamente");

            // Agregamos el nuevo artículo a la caché inmediatamente
            // para que aparezca en el <Select> y podamos autoseleccionarlo.
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

            // Autoseleccionamos el artículo recién creado
            setValue("articulo_id", articuloGuardado.id);

            // Cerramos el modal
            setModalNuevoArticulo(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ============================================
    // CREAR CATÁLOGOS (reutilizado de InventarioPage)
    // ============================================
    async function crearCategoria(values) {
        try {
            await createCategoria(values);
            toast.success("Categoría creada correctamente");
            queryClient.invalidateQueries({ queryKey: ["categorias-activo"] });
            setModalCategoria(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function crearTalla(values) {
        try {
            await createTalla(values);
            toast.success("Talla creada correctamente");
            queryClient.invalidateQueries({ queryKey: ["tallas-activo"] });
            setModalTalla(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function crearPropietario(values) {
        try {
            await createPropietario(values);
            toast.success("Propietario creado correctamente");
            queryClient.invalidateQueries({ queryKey: ["propietarios-activo"] });
            setModalPropietario(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function crearDanza(values) {
        try {
            await createDanza(values);
            toast.success("Danza creada correctamente");
            queryClient.invalidateQueries({ queryKey: ["danzas"] });
            setModalDanza(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ============================================
    // REGISTRAR MOVIMIENTO
    // ============================================
    async function onSubmit(data) {
        if (!perfil?.id) {
            toast.error("No se encontró el perfil del usuario. Vuelve a iniciar sesión.");
            return;
        }

        try {
            let detalles = null;

            if (esModificarDatos) {
                detalles = {
                    campo: "nombre",
                    antes: articuloSeleccionado?.nombre,
                    despues: data.nuevo_nombre,
                };
            }

            await registrar({
                articulo_id: data.articulo_id,
                usuario_id: perfil.id,
                tipo_movimiento: data.tipo_movimiento,
                cantidad: esModificarDatos ? 0 : Number(data.cantidad),
                motivo: data.motivo,
                detalles,
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

                {articuloSeleccionado && (
                    <div className="info-box" style={{
                        padding: "8px 12px",
                        background: "var(--bg-secondary, #f3f4f6)",
                        borderRadius: "6px",
                        marginBottom: "12px",
                        fontSize: "14px",
                    }}>
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

                {/* 3. Campo Dinámico */}
                {esModificarDatos ? (
                    <Input
                        label="Nuevo nombre del artículo"
                        placeholder="Ej: Camisa Blanca Manga Larga"
                        {...register("nuevo_nombre")}
                        error={errors.nuevo_nombre?.message}
                        required
                    />
                ) : (
                    <Input
                        label={esActualizarStock ? "Nuevo stock exacto" : "Cantidad"}
                        type="number"
                        placeholder="0"
                        {...register("cantidad")}
                        error={errors.cantidad?.message}
                        required
                    />
                )}

                {/* 4. Motivo */}
                <Input
                    label="Motivo"
                    placeholder="Ej: Compra a proveedor, Conteo físico, Prenda dañada..."
                    {...register("motivo")}
                    error={errors.motivo?.message}
                    required
                />

                {/* 5. Botón */}
                <div className="form-actions">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isRegistrando}
                        loading={isRegistrando}
                    >
                        Registrar Movimiento
                    </Button>
                </div>
            </form>

            {/* MODAL: Crear nuevo artículo (reutiliza ArticuloForm) */}
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

            {/* MODALES: Catálogos (categoría, talla, propietario, danza) */}
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