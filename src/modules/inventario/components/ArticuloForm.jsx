import { useForm } from "react-hook-form";
import { useEffect } from "react";


import { toast } from "sonner";

import CatalogoModal from "./CatalogoModal";


import { createCategoria,} from "@/modules/catalogos/categorias/services/categorias.service";
import { createTalla,} from "@/modules/catalogos/tallas/services/tallas.service";
import { createPropietario,} from "@/modules/catalogos/propietarios/services/propietarios.service";
import { createDanza,} from "@/modules/catalogos/danzas/services/danzas.service";

import {  useCatalogosInventario,} from "../hooks/useCatalogosInventario";
import {  generarCodigoArticulo,} from "../utils/generarCodigoArticulo";


export default function ArticuloForm({
  onSubmit,
  initialValues,
  onOpenCategoria,
  onOpenTalla,
  onOpenPropietario,
  onOpenDanza,
}) {

const {
  categorias,
  tallas,
  propietarios,
  danzas,
} = useCatalogosInventario();


const {
  register,
  handleSubmit,
  reset,
  watch,
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
  const nombre = watch("nombre");
  const tallaId = watch("talla_id");

  useEffect(() => {

    if (initialValues) {
      reset(initialValues);
    }

  }, [initialValues, reset]);


  


  async function enviar(data) {

    console.log(
  "DANZAS:",
  data.danzas_ids
);


await onSubmit(data);
    if (!initialValues) {
      reset();
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
  const tallaSeleccionada =
  tallas.data?.find(
    t => t.id === tallaId
  );

const codigoGenerado =
  generarCodigoArticulo(
    nombre,
    tallaSeleccionada?.nombre
  );

  return (

    <form
      onSubmit={handleSubmit(enviar)}
    >

      <h3>Datos generales</h3>

      <input
        {...register("nombre", {
          required: true,
        })}
        placeholder="Nombre del artículo" />

      <br />
      <br />

      <textarea
        {...register("descripcion")}
        placeholder="Descripción" />

      <br />
      <br />

      <label>Categoría</label>

      <select
        {...register("categoria_id", {
          required: true,
        })}
      >

        <option value="">
          Seleccione
        </option>

        {categorias.data?.map(
          categoria => (
            <option
              key={categoria.id}
              value={categoria.id}
            >
              {categoria.nombre}
            </option>
          )
        )}

      </select>
      <button type="button" onClick={onOpenCategoria}>
  + Nueva categoría
</button>
      <br />
      <br />

      <label>Talla</label>

      <select
        {...register("talla_id", {
          required: true,
        })}
      >

        <option value="">
          Seleccione
        </option>

        {tallas.data?.map(
          talla => (
            <option
              key={talla.id}
              value={talla.id}
            >
              {talla.nombre}
            </option>
          )
        )}

      </select>
      <button type="button" onClick={onOpenTalla}>
  + Nueva talla
</button>
      <br />
      <br />

      <label>Propietario</label>

      <select
        {...register("propietario_id", {
          required: true,
        })}
      >

        <option value="">
          Seleccione
        </option>

        {propietarios.data?.map(
          propietario => (
            <option
              key={propietario.id}
              value={propietario.id}
            >
              {propietario.nombre}
            </option>
          )
        )}

      </select>
     <button type="button" onClick={onOpenPropietario}>
  + Nuevo propietario
</button>
      <br />
      <br />

      <label>Danzas</label>

      <div>

        {danzas.data?.map((danza) => {

          const seleccionadas = watch("danzas_ids") || [];

          return (

            <div key={danza.id}>

              <label>

                <input
                  type="checkbox"
                  checked={seleccionadas.includes(
                    danza.id
                  )}
                  onChange={(e) => {

                    if (e.target.checked) {

                      setValue(
                        "danzas_ids",
                        [
                          ...seleccionadas,
                          danza.id,
                        ],
                        {
                          shouldValidate: true,
                        }
                      );

                    } else {

                      setValue(
                        "danzas_ids",
                        seleccionadas.filter(
                          id => id !== danza.id
                        ),
                        {
                          shouldValidate: true,
                        }
                      );

                    }

                  } } />

                {" "}
                {danza.nombre}

              </label>

            </div>

          );

        })}

      </div>

      <input
        type="hidden"
        {...register("danzas_ids")} />
     <button type="button" onClick={onOpenDanza}>
  + Nueva danza
</button>
      <br />
      <br />

      <label>Género</label>

      <select
        {...register("genero", {
          required: true,
        })}
      >

        <option value="masculino">
          Masculino
        </option>

        <option value="femenino">
          Femenino
        </option>

        <option value="unisex">
          Unisex
        </option>

      </select>

      <br />
      <br />

      <label>Stock actual</label>

      <input
        type="number"
        min="0"
        {...register(
          "stock_actual",
          {
            valueAsNumber: true,
          }
        )} />

      <br />
      <br />

      <label>Stock mínimo</label>

      <input
        type="number"
        min="1"
        {...register(
          "stock_min",
          {
            valueAsNumber: true,

            validate: value => value <= watch("stock_actual")
              || "El stock mínimo no puede ser mayor al stock actual",
          }
        )} />

      <br />
      <br />

      <textarea
        {...register(
          "observaciones"
        )}
        placeholder="Observaciones" />

      <br />
      <br />
      <hr />




      <h3>
        Código generado
      </h3>

      <p>

        <strong>

          {codigoGenerado || "—"}

        </strong>

      </p>

      <hr />
      <button type="submit">

        {initialValues
          ? "Actualizar"
          : "Guardar"}
      </button>



    </form>
  
  );
  

}