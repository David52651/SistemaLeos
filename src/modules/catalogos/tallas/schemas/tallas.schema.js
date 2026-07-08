import { z } from "zod";

export const tallaSchema = z.object({

  nombre: z
    .string()
    .min(
      1,
      "Ingrese una talla"
    ),

});