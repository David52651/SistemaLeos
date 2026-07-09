import PropTypes from "prop-types";

export default function Input({

    label,

    type = "text",

    placeholder = "",

    value,

    onChange,

    name,

    id,

    error,

    helper,

    required = false,

    disabled = false,

    readOnly = false,

    icon = null,

    fullWidth = true,

    className = "",

}) {

    const inputId = id || name;

    return (

        <div
            className={`form-group ${fullWidth ? "w-100" : ""} ${className}`}
        >

            {

                label && (

                    <label
                        htmlFor={inputId}
                        className="form-label"
                    >

                        {label}

                        {

                            required && (

                                <span className="required">

                                    *

                                </span>

                            )

                        }

                    </label>

                )

            }

            <div className="input-wrapper">

                {

                    icon && (

                        <span className="input-icon">

                            {icon}

                        </span>

                    )

                }

                <input

                    id={inputId}

                    name={name}

                    type={type}

                    value={value}

                    placeholder={placeholder}

                    onChange={onChange}

                    disabled={disabled}

                    readOnly={readOnly}

                    className={`
                        form-input
                        ${error ? "input-error" : ""}
                        ${icon ? "input-with-icon" : ""}
                    `}

                />

            </div>

            {

                helper && !error && (

                    <small className="input-helper">

                        {helper}

                    </small>

                )

            }

            {

                error && (

                    <small className="input-error-text">

                        {error}

                    </small>

                )

            }

        </div>

    );

}

Input.propTypes = {

    label: PropTypes.string,

    type: PropTypes.string,

    placeholder: PropTypes.string,

    value: PropTypes.oneOfType([

        PropTypes.string,

        PropTypes.number,

    ]),

    onChange: PropTypes.func,

    name: PropTypes.string,

    id: PropTypes.string,

    error: PropTypes.string,

    helper: PropTypes.string,

    required: PropTypes.bool,

    disabled: PropTypes.bool,

    readOnly: PropTypes.bool,

    icon: PropTypes.node,

    fullWidth: PropTypes.bool,

    className: PropTypes.string,

};