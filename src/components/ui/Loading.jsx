import PropTypes from "prop-types";

export default function Loading({

    text = "Cargando...",

    size = "md",

    fullScreen = false,

    className = "",

}) {

    const classes = [

        "loading",

        `loading-${size}`,

        fullScreen ? "loading-fullscreen" : "",

        className,

    ]
        .filter(Boolean)
        .join(" ");

    return (

        <div className={classes}>

            <div className="loading-spinner"></div>

            {

                text && (

                    <p className="loading-text">

                        {text}

                    </p>

                )

            }

        </div>

    );

}

Loading.propTypes = {

    text: PropTypes.string,

    size: PropTypes.oneOf([

        "sm",

        "md",

        "lg",

    ]),

    fullScreen: PropTypes.bool,

    className: PropTypes.string,

};