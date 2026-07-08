import { useState } from "react";
import { toast } from "sonner";

import { usePropietarios } from "../hooks/usePropietarios";

import PropietarioForm from "../components/PropietarioForm";

import {
  createPropietario,
  updatePropietario,
  desactivarPropietario,
  activarPropietario,
} from "../services/propietarios.service";

export default function PropietariosPage() {

  const {
    data: propietarios,
    isLoading,
    refetch,
  } = usePropietarios();

  const [editing, setEditing] = useState(null);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  async function crearPropietario(values) {

    try {

      await createPropietario(values);

      toast.success(
        "Propietario creado correctamente"
      );

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function editarPropietario(values) {

    try {

      await updatePropietario(
        editing.id,
        values
      );

      toast.success(
        "Propietario actualizado correctamente"
      );

      setEditing(null);

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function desactivarPropietarioHandler(id) {

    try {

      const confirmar = window.confirm(
        "¿Deseas desactivar este propietario?"
      );

      if (!confirmar) return;

      await desactivarPropietario(id);

      toast.success(
        "Propietario desactivado"
      );

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function activarPropietarioHandler(id) {

    try {

      await activarPropietario(id);

      toast.success(
        "Propietario activado"
      );

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function guardarPropietario(values) {

    if (editing) {

      await editarPropietario(values);
      return;

    }

    await crearPropietario(values);

  }

  return (

    <div>

      <h1>Propietarios</h1>

      <PropietarioForm
        onSubmit={guardarPropietario}
        initialValues={editing}
      />

      <hr />

      <table border="1">

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {propietarios?.map((propietario) => (

            <tr key={propietario.id}>

              <td>
                {propietario.nombre}
              </td>

              <td>
                {propietario.tipo}
              </td>

              <td>
                {propietario.telefono}
              </td>

              <td>
                {propietario.correo}
              </td>

              <td>
                {propietario.activo
                  ? "Activo"
                  : "Inactivo"}
              </td>

              <td>

                <button
                  onClick={() =>
                    setEditing(propietario)
                  }
                >
                  Editar
                </button>

                {propietario.activo ? (

                  <button
                    onClick={() =>
                      desactivarPropietarioHandler(
                        propietario.id
                      )
                    }
                  >
                    Desactivar
                  </button>

                ) : (

                  <button
                    onClick={() =>
                      activarPropietarioHandler(
                        propietario.id
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