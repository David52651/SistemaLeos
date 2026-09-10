import { z } from "zod";

export const movimientoSchema = z.object({
    articulo_id: z.string().uuid("Debe seleccionar un artículo válido"),
    
    tipo_movimiento: z.enum([
        "Agregar",
        "Desechar",
        "Actualizar Stock",
        "Modificar Datos"
    ]),
    
    cantidad: z.coerce.number().min(0, "La cantidad no puede ser negativa").optional(),
    
    motivo: z.string().min(3, "El motivo es obligatorio (mínimo 3 caracteres)").max(200, "Máximo 200 caracteres"),
    
    // Este campo solo se usa si el tipo es "Modificar Datos"
    nuevo_nombre: z.string().optional(),
})
.superRefine((data, ctx) => {
    // Validación condicional 1: Si NO es Modificar Datos, exigir cantidad > 0
    if (data.tipo_movimiento !== "Modificar Datos") {
        if (data.cantidad === undefined || data.cantidad <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La cantidad debe ser mayor a 0 para este tipo de movimiento",
                path: ["cantidad"],
            });
        }
    }

    // Validación condicional 2: Si ES Modificar Datos, exigir el nuevo nombre
    if (data.tipo_movimiento === "Modificar Datos") {
        if (!data.nuevo_nombre || data.nuevo_nombre.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debe ingresar el nuevo nombre del artículo",
                path: ["nuevo_nombre"],
            });
        }
    }
});