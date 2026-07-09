 import PropTypes from "prop-types";

export default function Button({

    children,

    variant = "primary",

    size = "md",

    type = "button",

    disabled = false,

    loading = false,

    fullWidth = false,

    icon = null,

    className = "",

    onClick,

}) {

    const classes = [

        "btn",

        `btn-${variant}`,

        `btn-${size}`,

        fullWidth ? "btn-full" : "",

        loading ? "btn-loading" : "",

        className,

    ]
        .filter(Boolean)
        .join(" ");


    return (

        <button

            type={type}

            className={classes}

            disabled={disabled || loading}

            onClick={onClick}

        >

            {

                loading && (

                    <span className="btn-spinner" />

                )

            }

            {

                icon && (

                    <span className="btn-icon">

                        {icon}

                    </span>

                )

            }

            <span>

                {children}

            </span>

        </button>

    );

}



Button.propTypes = {

    children: PropTypes.node,

    variant: PropTypes.oneOf([

        "primary",

        "secondary",

        "success",

        "danger",

        "warning",

        "outline",

        "ghost",

    ]),

    size: PropTypes.oneOf([

        "sm",

        "md",

        "lg",

    ]),

    type: PropTypes.oneOf([

        "button",

        "submit",

        "reset",

    ]),

    disabled: PropTypes.bool,

    loading: PropTypes.bool,

    fullWidth: PropTypes.bool,

    icon: PropTypes.node,

    className: PropTypes.string,

    onClick: PropTypes.func,

};