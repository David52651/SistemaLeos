import { useState } from "react";

import Checkbox from "./Checkbox";


export default function MultiSelectCheckbox({

    label,

    options = [],

    value = [],

    onChange,

}) {


    const [open,setOpen] = useState(false);



    function toggleOption(id){


        let newValue;



        if(value.includes(id)){


            newValue =
            value.filter(
                item => item !== id
            );


        }else{


            newValue = [
                ...value,
                id
            ];

        }



        onChange(newValue);


    }





    const selectedNames = options

        .filter(
            item =>
            value.includes(item.id)
        )

        .map(
            item =>
            item.nombre
        );





return (

<div className="multi-select">


    {
        label && (

            <label className="form-label">

                {label}

            </label>

        )
    }




    <button

        type="button"

        className="multi-select-button"

        onClick={()=>
            setOpen(!open)
        }

    >


        {

        selectedNames.length > 0

        ?

        selectedNames.join(", ")

        :

        "Seleccionar danzas"

        }



        <span>

            ▼

        </span>


    </button>






    {

    open && (

        <div className="multi-select-options">


            {
            options.map(item=>(


                <Checkbox

                    key={item.id}

                    label={item.nombre}


                    checked={
                        value.includes(item.id)
                    }


                    onChange={()=>
                        toggleOption(item.id)
                    }


                />


            ))

            }


        </div>


    )

    }




</div>


);


}