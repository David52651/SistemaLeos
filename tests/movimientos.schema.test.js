import test from "node:test";
import assert from "node:assert/strict";

import { movimientoSchema } from "../src/modules/movimientos/schemas/movimientos.schema.js";

const articuloId = "11111111-1111-4111-8111-111111111111";

test("acepta un movimiento de stock con cantidad positiva y motivo", () => {
  const result = movimientoSchema.safeParse({
    articulo_id: articuloId,
    tipo_movimiento: "Agregar",
    cantidad: "2",
    motivo: "Ingreso por compra",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.cantidad, 2);
});

test("rechaza cantidad cero en movimientos de stock", () => {
  const result = movimientoSchema.safeParse({
    articulo_id: articuloId,
    tipo_movimiento: "Desechar",
    cantidad: 0,
    motivo: "Prenda dañada",
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path[0] === "cantidad"));
});

test("exige nombre al modificar datos del artículo", () => {
  const result = movimientoSchema.safeParse({
    articulo_id: articuloId,
    tipo_movimiento: "Modificar Datos",
    motivo: "Corrección de información",
    nombre: " ",
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path[0] === "nombre"));
});
