import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";


import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import MultiSelectCheckbox from "@/components/ui/MultiSelectCheckbox";


import { useCatalogosInventario } 
from "../hooks/useCatalogosInventario";


import { generarCodigoArticulo }
from "../utils/generarCodigoArticulo";



export default function ArticuloForm({

  onSubmit,

  initialValues,

  onOpenCategoria,

  onOpenTalla,

  onOpenPropietario,

  onOpenDanza,

}) {


const [open,setOpen] = useState(false);





const {

  categorias,

  tallas,

  propietarios,

  danzas,

}=useCatalogosInventario();





const {

 register,

 handleSubmit,

 reset,

 watch,

 setValue,


}=useForm({


defaultValues:{


nombre:"",

descripcion:"",

categoria_id:"",

talla_id:"",

propietario_id:"",

genero:"unisex",

stock_actual:0,

stock_min:3,

observaciones:"",

activo:true,

danzas_ids:[],


}


});





const nombre =
watch("nombre");


const tallaId =
watch("talla_id");




const danzasSeleccionadas =
watch("danzas_ids") || [];







useEffect(()=>{


 if(initialValues){

    reset(initialValues);

    setOpen(true);

 }


},[initialValues,reset]);








async function enviar(data){


 await onSubmit(data);



 if(!initialValues){

    reset();

    setOpen(false);

 }


}








if(

categorias.isLoading ||

tallas.isLoading ||

propietarios.isLoading ||

danzas.isLoading

){

return (

<p>

Cargando catálogos...

</p>

)

}








const tallaSeleccionada =

tallas.data?.find(

t=>t.id===tallaId

);





const codigoGenerado =

generarCodigoArticulo(

nombre,

tallaSeleccionada?.nombre

);









return (


<div className="articulo-form-container">



<Button

type="button"

variant="primary"

onClick={()=>setOpen(!open)}

>


{

open

?

"Cancelar"

:

"+ Nuevo artículo"

}


</Button>





{

open && (



<form

onSubmit={handleSubmit(enviar)}

className="form-container"

>



<Card>


<h3>

Datos generales

</h3>





<Input

label="Nombre del artículo"

placeholder="Ejemplo: Camisa Blanca"

{

...register(

"nombre",

{

required:true

}

)

}

/>





<Input

label="Descripción"

placeholder="Descripción del artículo"

as="textarea"

{

...register("descripcion")

}

/>







<Select

label="Categoría"

{

...register(

"categoria_id",

{

required:true

}

)

}

>


<option value="">

Seleccione

</option>


{

categorias.data?.map(

categoria=>(

<option

key={categoria.id}

value={categoria.id}

>

{categoria.nombre}

</option>

)

)

}


</Select>





<Button

type="button"

variant="secondary"

onClick={onOpenCategoria}

>

+ Nueva categoría

</Button>








<Select

label="Talla"

{

...register(

"talla_id",

{

required:true

}

)

}

>


<option value="">

Seleccione

</option>


{

tallas.data?.map(

talla=>(


<option

key={talla.id}

value={talla.id}

>

{talla.nombre}

</option>


)

)

}


</Select>





<Button

type="button"

variant="secondary"

onClick={onOpenTalla}

>

+ Nueva talla

</Button>








<Select

label="Propietario"

{

...register(

"propietario_id",

{

required:true

}

)

}

>


<option value="">

Seleccione

</option>


{

propietarios.data?.map(

propietario=>(


<option

key={propietario.id}

value={propietario.id}

>

{propietario.nombre}

</option>


)

)

}


</Select>






<Button

type="button"

variant="secondary"

onClick={onOpenPropietario}

>

+ Nuevo propietario

</Button>








<MultiSelectCheckbox

label="Danzas asociadas"

options={danzas.data || []}

value={danzasSeleccionadas}

onChange={(values)=>{

setValue(

"danzas_ids",

values,

{

shouldValidate:true

}

);

}}

/>






<Button

type="button"

variant="secondary"

onClick={onOpenDanza}

>

+ Nueva danza

</Button>









<Select

label="Género"

{

...register("genero")

}

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


</Select>










<Input

label="Stock actual"

type="number"

min="0"

{

...register(

"stock_actual",

{

valueAsNumber:true

}

)

}

/>






<Input

label="Stock mínimo"

type="number"

min="1"

{

...register(

"stock_min",

{

valueAsNumber:true

}

)

}

/>






<Input

label="Observaciones"

as="textarea"

{

...register("observaciones")

}

/>







<div className="codigo-generado">


<h3>

Código generado

</h3>


<strong>

{codigoGenerado || "—"}

</strong>


</div>








<Button

type="submit"

variant="primary"

>


{

initialValues

?

"Actualizar"

:

"Guardar"

}


</Button>





</Card>



</form>


)


}



</div>


)



}