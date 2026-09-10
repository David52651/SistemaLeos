import { z } from "zod";

export const movimientoSchema = z.object({
    articulo_id: z.string().uuid("Debe seleccionar un artículo válido"),

    tipo_movimiento: z.enum([
        "Agregar",
        "Desechar",
        "Actualizar Stock",
        "Modificar Datos",
    ]),

    cantidad: z.coerce.number().min(0, "La cantidad no puede ser negativa").optional(),

    motivo: z.string().min(3, "El motivo es obligatorio (mínimo 3 caracteres)").max(200),

    // Campos de "Modificar Datos"
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    categoria_id: z.string().optional(),
    talla_id: z.string().optional(),
    propietario_id: z.string().optional(),
    genero: z.string().optional(),
    stock_min: z.coerce.number().optional(),
    observaciones: z.string().optional(),
})
.superRefine((data, ctx) => {
    // Si es movimiento de stock, exigir cantidad > 0
    if (data.tipo_movimiento !== "Modificar Datos") {
        if (!data.cantidad || data.cantidad <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La cantidad debe ser mayor a 0 para este tipo de movimiento",
                path: ["cantidad"],
            });
        }
    }

    // Si es modificar datos, exigir nombre
    if (data.tipo_movimiento === "Modificar Datos") {
        if (!data.nombre || data.nombre.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El nombre del artículo es obligatorio",
                path: ["nombre"],
            });
        }
    }
});