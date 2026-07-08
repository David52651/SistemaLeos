import { useState } from "react";
import { toast } from "sonner";

import { useCategorias } from "../hooks/useCategorias";

import CategoriaForm from "../components/CategoriaForm";

import {
  createCategoria,
  updateCategoria,
  desactivarCategoria,
  activarCategoria,
} from "../services/categorias.service";

export default function CategoriasPage() {

  const {
    data: categorias,
    isLoading,
    refetch,
  } = useCategorias();

  const [editing, setEditing] = useState(null);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  async function crearCategoria(values) {

    try {

      await createCategoria(values);

      toast.success(
        "Categoría creada correctamente"
      );

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function editarCategoria(values) {

    try {

      await updateCategoria(
        editing.id,
        values
      );

      toast.success(
        "Categoría actualizada correctamente"
      );

      setEditing(null);

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function desactivarCategoriaHandler(id) {

    try {

      const confirmar = window.confirm(
        "¿Deseas desactivar esta categoría?"
      );

      if (!confirmar) return;

      await desactivarCategoria(id);

      toast.success(
        "Categoría desactivada"
      );

      refetch();

    } catch (error) {

      toast.error(error.message);

    }

  }

  async function guardarCategoria(values) {

    if (editing) {
      await editarCategoria(values);
      return;
    }

    await crearCategoria(values);

  }

  return (
    <div>

      <h1>Categorías</h1>

      <CategoriaForm
        onSubmit={guardarCategoria}
        initialValues={editing}
      />

      <hr />

      <table border="1">

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {categorias?.map((categoria) => (

            <tr key={categoria.id}>

              <td>
                {categoria.nombre}
              </td>

              <td>
                {categoria.descripcion}
              </td>

              <td>
                {categoria.activo
                  ? "Activa"
                  : "Inactiva"}
              </td>

              <td>

<button
  onClick={() => setEditing(categoria)}
>
  Editar
</button>

  {categoria.activo ? (

    <button
onClick={() =>
  desactivarCategoriaHandler(categoria.id)
}
    >
      Desactivar
    </button>

  ) : (

    <button
      onClick={async () => {

        await activarCategoria(
          categoria.id
        );

        toast.success(
          "Categoría activada"
        );

        refetch();

      }}
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