import { useForm, Controller } from "react-hook-form";    
import { useEffect } from "react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/ui/RichTextEditor";   


export default function DanzaForm({
    onSubmit,
    initialValues,
}) {

    const {
        register,
        handleSubmit,
        reset,
        control,                                            
    } = useForm({
        defaultValues: {
            nombre: "",
            ciudad: "",
            descripcion: "",
        },
    });

    useEffect(() => {

        if (initialValues) {
            reset({
                nombre: initialValues.nombre,
                ciudad: initialValues.ciudad,
                descripcion: initialValues.descripcion || "",
            });
        } else {
            reset({
                nombre: "",
                ciudad: "",
                descripcion: "",
            });
        }

    }, [initialValues, reset]);

    async function enviar(data) {
        await onSubmit(data);
        if (!initialValues) {
            reset({
                nombre: "",
                ciudad: "",
                descripcion: "",
            });
        }
    }

    return (
        <form onSubmit={handleSubmit(enviar)} className="form-container">

            <Input
                label="Nombre de la danza"
                placeholder="Ejemplo: Cashua"
                {...register("nombre", { required: true })}
            />

            <Input
                label="Ciudad"
                placeholder="Ejemplo: Cajamarca"
                {...register("ciudad")}
            />

            {/* editor enriquecido en lugar del Input textarea */}
            <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                    <RichTextEditor
                        label="Descripción"
                        placeholder="Descripción de la danza..."
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />

            <div className="form-actions">
                <Button type="submit" variant="primary">
                    {initialValues ? "Actualizar" : "Guardar"}
                </Button>
            </div>

        </form>
    );
}