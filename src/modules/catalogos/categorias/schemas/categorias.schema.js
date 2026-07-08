import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(3, "Mínimo 3 caracteres"),

  descripcion: z
    .string()
    .optional(),

  activo: z.boolean(),
});