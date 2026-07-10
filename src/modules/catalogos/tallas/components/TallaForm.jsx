import { useForm } from "react-hook-form";
import { useEffect } from "react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function TallaForm({
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

            activo: true,

        },

    });

    useEffect(() => {

        if (initialValues) {

            reset({

                nombre: initialValues.nombre,

                activo: initialValues.activo,

            });

        } else {

            reset({

                nombre: "",

                activo: true,

            });

        }

    }, [initialValues, reset]);

    async function enviar(data) {

        await onSubmit(data);

        if (!initialValues) {

            reset({

                nombre: "",

                activo: true,

            });

        }

    }

    return (

        <form
            onSubmit={handleSubmit(enviar)}
            className="form-container"
        >

            <Input

                label="Nombre de la talla"

                placeholder="Ejemplo: S, M, L, XL, 12..."

                {...register("nombre", {

                    required: true,

                })}

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