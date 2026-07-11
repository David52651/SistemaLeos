import { useEffect } from "react";

import Button from "./Button";

export default function Modal({

    open,

    onClose,

    title,

    children,

    footer = null,

    closeOnOverlay = true,

}) {

    /* ==========================================
       CERRAR CON ESC
    ========================================== */

    useEffect(() => {

        if (!open) return;

        function handleKeyDown(event) {

            if (event.key === "Escape") {

                onClose?.();

            }

        }

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [open, onClose]);



    /* ==========================================
       NO RENDERIZAR SI ESTA CERRADO
    ========================================== */

    if (!open) return null;



    /* ==========================================
       CERRAR AL HACER CLICK FUERA
    ========================================== */

    function handleOverlayClick(event) {

        if (

            closeOnOverlay &&

            event.target === event.currentTarget

        ) {

            onClose?.();

        }

    }



    /* ==========================================
       RENDER
    ========================================== */

    return (

        <div

            className="modal-overlay"

            onClick={handleOverlayClick}

        >

            <div

                className="modal-container"

            >

                {

                    (title || onClose) && (

                        <div className="modal-header">

                            <h3>

                                {title}

                            </h3>

                            <Button

                                type="button"

                                variant="ghost"

                                onClick={onClose}

                            >

                                ✕

                            </Button>

                        </div>

                    )

                }



                <div className="modal-body">

                    {children}

                </div>



                {

                    footer && (

                        <div className="modal-footer">

                            {footer}

                        </div>

                    )

                }

            </div>

        </div>

    );

}