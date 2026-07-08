import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function PropietarioForm({
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
      tipo: "persona",
      telefono: "",
      correo: "",
      observaciones: "",
      activo: true,

    },

  });

  useEffect(() => {

    if (initialValues) {

      reset(initialValues);

    } else {

      reset({
        nombre: "",
        tipo: "persona",
        telefono: "",
        correo: "",
        observaciones: "",
        activo: true,
      });

    }

  }, [initialValues, reset]);

  async function enviar(data) {

    await onSubmit(data);

    if (!initialValues) {

      reset();

    }

  }

  return (

    <form
      onSubmit={handleSubmit(enviar)}
    >

      <div>
        <label>Nombre</label>

        <input
          {...register("nombre")}
        />
      </div>

      <div>

        <label>Tipo</label>

        <select
  {...register("tipo")}
>

  <option value="">
    Seleccione
  </option>

  <option value="grupo">
    Grupo
  </option>

  <option value="institucion">
    Institución
  </option>

  <option value="persona">
    Persona
  </option>

</select>
      </div>

      <div>

        <label>Teléfono</label>

        <input
          {...register("telefono")}
        />

      </div>

      <div>

        <label>Correo</label>

        <input
          {...register("correo")}
        />

      </div>

      <div>

        <label>Observaciones</label>

        <textarea
          {...register("observaciones")}
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