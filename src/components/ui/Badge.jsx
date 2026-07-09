import PropTypes from "prop-types";

export default function Badge({

    children,

    variant = "primary",

    rounded = true,

    className = "",

}) {

    const classes = [

        "badge",

        `badge-${variant}`,

        rounded ? "badge-rounded" : "",

        className,

    ]
        .filter(Boolean)
        .join(" ");

    return (

        <span className={classes}>

            {children}

        </span>

    );

}

Badge.propTypes = {

    children: PropTypes.node.isRequired,

    variant: PropTypes.oneOf([

        "primary",

        "secondary",

        "success",

        "warning",

        "danger",

        "info",

        "dark",

        "light",

    ]),

    rounded: PropTypes.bool,

    className: PropTypes.string,

};