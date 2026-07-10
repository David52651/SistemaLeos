import React from "react";


const Select = React.forwardRef(({

    label,

    error,

    children,

    className = "",

    required = false,

    ...props


}, ref) => {


    return (

        <div

            className={`
                form-group
                ${className}
            `}

        >


            {
                label && (

                    <label

                        className={`
                            form-label
                            ${required ? "required" : ""}
                        `}

                    >

                        {label}

                    </label>

                )
            }



            <select

                ref={ref}

                className={`
                    form-select
                    ${error ? "error" : ""}
                `}

                {...props}

            >

                {children}

            </select>




            {
                error && (

                    <span

                        className="form-error"

                    >

                        {error}

                    </span>

                )
            }


        </div>

    );

});


Select.displayName = "Select";


export default Select;