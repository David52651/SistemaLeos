import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import MultiSelectCheckbox from "@/components/ui/MultiSelectCheckbox";

import { useCatalogosInventario } from "../hooks/useCatalogosInventario";
import { generarCodigoArticulo } from "../utils/generarCodigoArticulo";


export default function ArticuloForm({
  onSubmit,
  initialValues,
  onOpenCategoria,
  onOpenTalla,
  onOpenPropietario,
  onOpenDanza,
  hideToggleButton = false,
}) {

  const [internalOpen, setInternalOpen] = useState(false);
  const open = hideToggleButton || internalOpen; 

  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");

  const { categorias, tallas, propietarios, danzas } = useCatalogosInventario();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      categoria_id: "",
      talla_id: "",
      propietario_id: "",
      genero: "unisex",
      stock_actual: 0,
      stock_min: 3,
      observaciones: "",
      activo: true,
      danzas_ids: [],
    },
  });

  const nombre = useWatch({ control, name: "nombre" });
  const tallaId = useWatch({ control, name: "talla_id" });
  const danzasSeleccionadas = useWatch({ control, name: "danzas_ids" }) || [];

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      // Sincroniza el estado visual con los valores recibidos como props.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalOpen(true);
      if (initialValues.imagen_url) {
        setImagenPreview(initialValues.imagen_url);
      }
    }
  }, [initialValues, reset]);

  function handleImagenChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  }

  async function enviar(data) {
    await onSubmit(data, imagenFile); 
    
    if (!initialValues) {
      reset();
      setImagenFile(null);
      setImagenPreview("");
      if (!hideToggleButton) {
        setInternalOpen(false);
      }
    }
  }

  if (
    categorias.isLoading ||
    tallas.isLoading ||
    propietarios.isLoading ||
    danzas.isLoading
  ) {
    return <p>Cargando catálogos...</p>;
  }

  const tallaSeleccionada = tallas.data?.find((t) => t.id === tallaId);
  const codigoGenerado = generarCodigoArticulo(nombre, tallaSeleccionada?.nombre);

  return (
    <div className="articulo-form-container">

      {!hideToggleButton && (
        <Button
          type="button"
          variant="primary"
          onClick={() => setInternalOpen(!internalOpen)}
          style={{ marginBottom: "1rem" }}
        >
          {internalOpen ? "Cancelar" : "+ Nuevo artículo"}
        </Button>
      )}

      {open && (
        <form onSubmit={handleSubmit(enviar)} className="form-container">
          <Card>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Datos generales</h3>

            {/* FILA 1: Nombre y Género */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1rem" }}>
                <Input
                  label="Nombre del artículo"
                  placeholder="Ejemplo: Camisa Blanca"
                  {...register("nombre", { required: true })}
                />
                <Select label="Género" {...register("genero")}>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="unisex">Unisex</option>
                </Select>
            </div>

            <Input
              label="Descripción"
              placeholder="Descripción del artículo"
              as="textarea"
              {...register("descripcion")}
              style={{ marginBottom: "1rem" }}
            />

            {/* FILA 2: Imagen */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Imagen del artículo (opcional)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImagenChange} 
                className="form-control" 
              />
              {imagenPreview && (
                <div style={{ marginTop: "10px" }}>
                  <img 
                    src={imagenPreview} 
                    alt="Vista previa" 
                    style={{ 
                      width: "120px", 
                      height: "120px", 
                      objectFit: "cover", 
                      borderRadius: "8px",
                      border: "2px solid var(--border-color)"
                    }} 
                  />
                </div>
              )}
            </div>

            {/* FILA 3: Categoría, Talla y Propietario + Botones al lado */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                
                {/* Categoría */}
                <div>
                  <Select label="Categoría" {...register("categoria_id", { required: true })}>
                    <option value="">Seleccione</option>
                    {categorias.data?.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                  </Select>
                  <Button type="button" variant="ghost" onClick={onOpenCategoria} style={{ marginTop: "4px", padding: 0, fontSize: "0.8rem" }}>
                    + Añadir categoría
                  </Button>
                </div>

                {/* Talla */}
                <div>
                  <Select label="Talla" {...register("talla_id", { required: true })}>
                    <option value="">Seleccione</option>
                    {tallas.data?.map((talla) => (
                      <option key={talla.id} value={talla.id}>{talla.nombre}</option>
                    ))}
                  </Select>
                  <Button type="button" variant="ghost" onClick={onOpenTalla} style={{ marginTop: "4px", padding: 0, fontSize: "0.8rem" }}>
                    + Añadir talla
                  </Button>
                </div>

                {/* Propietario */}
                <div>
                  <Select label="Propietario" {...register("propietario_id", { required: true })}>
                    <option value="">Seleccione</option>
                    {propietarios.data?.map((propietario) => (
                      <option key={propietario.id} value={propietario.id}>{propietario.nombre}</option>
                    ))}
                  </Select>
                  <Button type="button" variant="ghost" onClick={onOpenPropietario} style={{ marginTop: "4px", padding: 0, fontSize: "0.8rem" }}>
                    + Añadir propietario
                  </Button>
                </div>
            </div>

            {/* FILA 4: Danzas Asociadas */}
            <div style={{ marginBottom: "1.5rem" }}>
              <MultiSelectCheckbox
                label="Danzas asociadas"
                options={danzas.data || []}
                value={danzasSeleccionadas}
                onChange={(values) => {
                  setValue("danzas_ids", values, { shouldValidate: true });
                }}
              />
              <Button type="button" variant="ghost" onClick={onOpenDanza} style={{ marginTop: "4px", padding: 0, fontSize: "0.8rem" }}>
                + Añadir danza
              </Button>
            </div>

            {/* FILA 5: Stock actual y Stock mínimo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1rem" }}>
                <Input
                  label="Stock actual"
                  type="number"
                  min="0"
                  {...register("stock_actual", { valueAsNumber: true })}
                />
                <Input
                  label="Stock mínimo"
                  type="number"
                  min="1"
                  {...register("stock_min", { valueAsNumber: true })}
                />
            </div>

            <Input
              label="Observaciones"
              as="textarea"
              {...register("observaciones")}
              style={{ marginBottom: "1.5rem" }}
            />

            <div className="codigo-generado" style={{ 
                background: "var(--bg-hover)", 
                padding: "12px", 
                borderRadius: "8px", 
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
              <span style={{ fontWeight: 600, opacity: 0.7 }}>Código generado:</span>
              <strong style={{ fontSize: "1.1rem", color: "var(--color-primary)" }}>{codigoGenerado || "—"}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="primary">
                  {initialValues ? "Actualizar" : "Guardar Artículo"}
                </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}