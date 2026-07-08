import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function CategoriaForm({ onSubmit, initialValues }) {

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      activo: true,
    },
  });
  useEffect(() => {

  if (initialValues) {
    reset(initialValues);
  }

}, [initialValues, reset]);

  async function enviar(data) {

    await onSubmit(data);

    reset();
  }

  return (
    <form onSubmit={handleSubmit(enviar)}>

      <div>

        <label>Nombre</label>

        <input
          {...register("nombre")}
        />

      </div>

      <div>

        <label>Descripción</label>

        <textarea
          {...register("descripcion")}
        />

      </div>

      <button type="submit">
        Guardar
      </button>

    </form>
  );
}