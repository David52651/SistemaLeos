import React from "react";


export default function Checkbox({

    label,

    checked,

    onChange,

    disabled=false,

    className=""

}) {


    return (

        <label

            className={`checkbox-container ${className}`}

        >


            <input

                type="checkbox"

                checked={checked}

                onChange={onChange}

                disabled={disabled}

            />


            <span className="checkbox-custom"></span>


            <span className="checkbox-label">

                {label}

            </span>



        </label>

    );


}