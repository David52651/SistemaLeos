import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function TallaForm({
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
activo: true,
},
});

useEffect(() => {

if (initialValues) {

  reset({
    nombre: initialValues.nombre,
    activo: initialValues.activo,
  });

} else {

  reset({
    nombre: "",
    activo: true,
  });

}


}, [initialValues, reset]);

async function enviar(data) {


await onSubmit(data);

if (!initialValues) {

  reset({
    nombre: "",
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
      Nombre de la talla
    </label>

    <input
      {...register("nombre")}
      placeholder="Ej: S, M, L, XL, 12..."
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
