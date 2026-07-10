import { useForm } from "react-hook-form";
import { useEffect } from "react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function DanzaForm({ onSubmit, initialValues }) {
  const {
    register,

    handleSubmit,

    reset,

    formState: { errors, isSubmitting },
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

        descripcion: initialValues.descripcion,

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
    <form onSubmit={handleSubmit(enviar)} className="form-container">
      <Input
        label="Nombre de la danza"

        placeholder="Ejemplo: Cashua"

        {...register("nombre", {
          required: "El nombre es obligatorio",
          minLength: {
            value: 3,
            message: "Debe tener al menos 3 caracteres",
          },
          maxLength: {
            value: 100,
            message: "Máximo 100 caracteres",
          },
        })}
      />

      <Input
        label="Ciudad"

        placeholder="Ejemplo: Cajamarca"

        {...register("ciudad")}
      />

      <Input
        label="Descripción"

        as="textarea"

        placeholder="Descripción de la danza"

        {...register("descripcion")}
      />

      <div className="form-actions">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {initialValues ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}