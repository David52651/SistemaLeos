import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function DanzaForm({
  onSubmit,
  initialValues,
}) {

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      ciudad: "",
      descripcion: "",
      activo: true,
    },
  });

  useEffect(() => {

    if (initialValues) {

      reset({
        nombre: initialValues.nombre,
        ciudad: initialValues.ciudad,
        descripcion:
          initialValues.descripcion,
        activo: initialValues.activo,
      });

    } else {

      reset({
        nombre: "",
        ciudad: "",
        descripcion: "",
        activo: true,
      });

    }

  }, [initialValues, reset]);

  async function enviar(data) {

    await onSubmit(data);

    if (!initialValues) {

      reset({
        nombre: "",
        ciudad: "",
        descripcion: "",
        activo: true,
      });

    }

  }

  return (

    <form
      onSubmit={handleSubmit(enviar)}
    >

      <div>

        <label>
          Nombre
        </label>

        <input
          {...register("nombre")}
        />

      </div>

      <div>

        <label>
          Ciudad
        </label>

        <input
          {...register("ciudad")}
        />

      </div>

      <div>

        <label>
          Descripción
        </label>

        <textarea
          {...register("descripcion")}
        />

      </div>

      <br />

      <button type="submit">

        {initialValues
          ? "Actualizar"
          : "Guardar"}

      </button>

    </form>

  );

}