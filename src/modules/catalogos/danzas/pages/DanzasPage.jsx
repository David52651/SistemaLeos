import { useState } from "react";
import { toast } from "sonner";

import { useDanzas } from "../hooks/useDanzas";

import DanzaForm from "../components/DanzaForm";

import {
  createDanza,
  updateDanza,
  desactivarDanza,
  activarDanza,
} from "../services/danzas.service";

export default function DanzasPage() {

  const {
    data: danzas,
    isLoading,
    refetch,
  } = useDanzas();

  const [editing, setEditing] =
    useState(null);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  async function crearDanza(values) {

    try {

      await createDanza(values);

      toast.success(
        "Danza creada correctamente"
      );

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function editarDanza(values) {

    try {

      await updateDanza(
        editing.id,
        values
      );

      toast.success(
        "Danza actualizada correctamente"
      );

      setEditing(null);

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function guardarDanza(values) {

    if (editing) {

      await editarDanza(values);

      return;

    }

    await crearDanza(values);

  }

  async function desactivarDanzaHandler(
    id
  ) {

    const confirmar =
      window.confirm(
        "¿Desactivar danza?"
      );

    if (!confirmar) return;

    await desactivarDanza(id);

    toast.success(
      "Danza desactivada"
    );

    refetch();

  }

  async function activarDanzaHandler(
    id
  ) {

    await activarDanza(id);

    toast.success(
      "Danza activada"
    );

    refetch();

  }

  return (

    <div>

      <h1>Danzas</h1>

      <DanzaForm
        onSubmit={guardarDanza}
        initialValues={editing}
      />

      <hr />

      <table border="1">

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {danzas?.map((danza) => (

            <tr key={danza.id}>

              <td>{danza.nombre}</td>

              <td>{danza.ciudad}</td>

              <td>
                {danza.descripcion}
              </td>

              <td>
                {danza.activo
                  ? "Activa"
                  : "Inactiva"}
              </td>

              <td>

                <button
                  onClick={() =>
                    setEditing(danza)
                  }
                >
                  Editar
                </button>

                {danza.activo ? (

                  <button
                    onClick={() =>
                      desactivarDanzaHandler(
                        danza.id
                      )
                    }
                  >
                    Desactivar
                  </button>

                ) : (

                  <button
                    onClick={() =>
                      activarDanzaHandler(
                        danza.id
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