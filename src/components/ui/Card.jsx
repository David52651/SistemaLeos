import PropTypes from "prop-types";

export default function Card({

    title,

    subtitle,

    children,

    footer,

    actions,

    className = "",

    hover = true,

    padding = "md",

}) {

    const classes = [

        "card",

        hover ? "card-hover" : "",

        `card-padding-${padding}`,

        className,

    ]
        .filter(Boolean)
        .join(" ");


    return (

        <div className={classes}>


            {(title || subtitle || actions) && (

                <div className="card-header">

                    <div className="card-header-content">

                        {

                            title && (

                                <h3 className="card-title">

                                    {title}

                                </h3>

                            )

                        }

                        {

                            subtitle && (

                                <p className="card-subtitle">

                                    {subtitle}

                                </p>

                            )

                        }

                    </div>

                    {

                        actions && (

                            <div className="card-actions">

                                {actions}

                            </div>

                        )

                    }

                </div>

            )}


            <div className="card-body">

                {children}

            </div>


            {

                footer && (

                    <div className="card-footer">

                        {footer}

                    </div>

                )

            }


        </div>

    );

}



Card.propTypes = {

    title: PropTypes.string,

    subtitle: PropTypes.string,

    children: PropTypes.node,

    footer: PropTypes.node,

    actions: PropTypes.node,

    className: PropTypes.string,

    hover: PropTypes.bool,

    padding: PropTypes.oneOf([

        "sm",

        "md",

        "lg",

    ]),

};
