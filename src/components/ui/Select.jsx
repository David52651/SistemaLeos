import React from "react";


export default function Select({
    label,
    error,
    children,
    className = "",
    ...props
}) {


    return (

        <div className={`form-group ${className}`}>



            {
                label && (

                    <label className="form-label">

                        {label}

                    </label>

                )
            }



            <select

                className="form-select"

                {...props}

            >

                {children}

            </select>



            {
                error && (

                    <span className="form-error">

                        {error}

                    </span>

                )
            }



        </div>

    );

}