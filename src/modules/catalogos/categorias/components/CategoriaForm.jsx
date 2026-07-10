import { useForm } from "react-hook-form";
import { useEffect } from "react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CategoriaForm({
    onSubmit,
    initialValues,
}) {

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({

        defaultValues: {

            nombre: "",
            descripcion: "",
            activo: true,

        }

    });

    /* ==========================================
       CARGAR DATOS AL EDITAR
    ========================================== */

    useEffect(() => {

        if (initialValues) {

            reset({

                nombre: initialValues.nombre,

                descripcion: initialValues.descripcion,

                activo: initialValues.activo,

            });

        } else {

            reset({

                nombre: "",

                descripcion: "",

                activo: true,

            });

        }

    }, [initialValues, reset]);

    /* ==========================================
       ENVIAR FORMULARIO
    ========================================== */

    async function enviar(data) {

        await onSubmit(data);

        if (!initialValues) {

            reset({

                nombre: "",

                descripcion: "",

                activo: true,

            });

        }

    }

    /* ==========================================
       RENDER
    ========================================== */

    return (

        <form
            onSubmit={handleSubmit(enviar)}
            className="form-container"
        >

            <Input

                label="Nombre de la categoría"

                placeholder="Ejemplo: Camisa"

                {...register("nombre", {

                    required: true,

                })}

            />

            <Input

                label="Descripción"

                as="textarea"

                placeholder="Descripción de la categoría"

                {...register("descripcion")}

            />

            <div className="form-actions">

                <Button
                    type="submit"
                    variant="primary"
                >

                    {

                        initialValues

                            ? "Actualizar"

                            : "Guardar"

                    }

                </Button>

            </div>

        </form>

    );

}