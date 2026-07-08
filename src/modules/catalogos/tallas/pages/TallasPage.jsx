import { useState } from "react";
import { toast } from "sonner";

import { useTallas } from "../hooks/useTallas";

import TallaForm from "../components/TallaForm";

import {
createTalla,
updateTalla,
desactivarTalla,
activarTalla,
} from "../services/tallas.service";

export default function TallasPage() {

const {
data: tallas,
isLoading,
refetch,
} = useTallas();

const [editing, setEditing] = useState(null);

if (isLoading) {
return <p>Cargando...</p>;
}

async function crearTalla(values) {


try {

  await createTalla(values);

  toast.success(
    "Talla creada correctamente"
  );

  refetch();

} catch (error) {

  toast.error(error.message);

}


}

async function editarTalla(values) {


try {

  await updateTalla(
    editing.id,
    values
  );

  toast.success(
    "Talla actualizada correctamente"
  );

  setEditing(null);

  refetch();

} catch (error) {

  toast.error(error.message);

}


}

async function desactivarTallaHandler(id) {


try {

  const confirmar = window.confirm(
    "¿Deseas desactivar esta talla?"
  );

  if (!confirmar) return;

  await desactivarTalla(id);

  toast.success(
    "Talla desactivada"
  );

  refetch();

} catch (error) {

  toast.error(error.message);

}


}

async function activarTallaHandler(id) {


try {

  await activarTalla(id);

  toast.success(
    "Talla activada"
  );

  refetch();

} catch (error) {

  toast.error(error.message);

}


}

async function guardarTalla(values) {


if (editing) {

  await editarTalla(values);
  return;

}

await crearTalla(values);


}

return ( <div>

 
  <h1>Tallas</h1>

  <TallaForm
    onSubmit={guardarTalla}
    initialValues={editing}
  />

  <hr />

  <table border="1">

    <thead>

      <tr>
        <th>Talla</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>

    </thead>

    <tbody>

      {tallas?.map((talla) => (

        <tr key={talla.id}>

          <td>
            {talla.nombre}
          </td>

          <td>
            {talla.activo
              ? "Activa"
              : "Inactiva"}
          </td>

          <td>

            <button
              onClick={() =>
                setEditing(talla)
              }
            >
              Editar
            </button>

            {talla.activo ? (

              <button
                onClick={() =>
                  desactivarTallaHandler(
                    talla.id
                  )
                }
              >
                Desactivar
              </button>

            ) : (

              <button
                onClick={() =>
                  activarTallaHandler(
                    talla.id
                  )
                }
              >
                Activar
              </button>

            )}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
);
}
