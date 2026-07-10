import { useForm } from "react-hook-form";
import { useEffect } from "react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function PropietarioForm({
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

            tipo: "persona",

            telefono: "",

            correo: "",

            observaciones: "",

            activo: true,

        },

    });

    useEffect(() => {

        if (initialValues) {

            reset({

                nombre: initialValues.nombre,

                tipo: initialValues.tipo,

                telefono: initialValues.telefono,

                correo: initialValues.correo,

                observaciones: initialValues.observaciones,

                activo: initialValues.activo,

            });

        } else {

            reset({

                nombre: "",

                tipo: "persona",

                telefono: "",

                correo: "",

                observaciones: "",

                activo: true,

            });

        }

    }, [initialValues, reset]);

    async function enviar(data) {

        await onSubmit(data);

        if (!initialValues) {

            reset({

                nombre: "",

                tipo: "persona",

                telefono: "",

                correo: "",

                observaciones: "",

                activo: true,

            });

        }

    }

    return (

        <form

            onSubmit={handleSubmit(enviar)}

            className="form-container"

        >

            <div className="form-grid">

                <Input

                    label="Nombre"

                    placeholder="Nombre del propietario"

                    {...register("nombre", {

                        required: true,

                    })}

                />

                <Select

                    label="Tipo"

                    {...register("tipo")}

                >

                    <option value="persona">

                        Persona

                    </option>

                    <option value="grupo">

                        Grupo

                    </option>

                    <option value="institucion">

                        Institución

                    </option>

                </Select>

                <Input

                    label="Teléfono"

                    placeholder="+51123456789"

                    {...register("telefono")}

                />

                <Input

                    label="Correo"

                    type="email"

                    placeholder="correo@ejemplo.com"

                    {...register("correo")}

                />

            </div>

            <Input

                label="Observaciones"

                as="textarea"

                placeholder="Observaciones del propietario"

                {...register("observaciones")}

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