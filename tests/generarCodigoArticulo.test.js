import test from "node:test";
import assert from "node:assert/strict";

import { generarCodigoArticulo } from "../src/modules/inventario/utils/generarCodigoArticulo.js";

test("genera el código con palabras y talla", () => {
  assert.equal(
    generarCodigoArticulo("Camisa de Cajamarca", "M"),
    "CAM-CAJ-M"
  );
});

test("omite conectores en el nombre", () => {
  assert.equal(
    generarCodigoArticulo("Sombrero de la Danza", "Única"),
    "SOM-DAN-Única"
  );
});

test("devuelve una cadena vacía si falta el nombre o la talla", () => {
  assert.equal(generarCodigoArticulo("", "M"), "");
  assert.equal(generarCodigoArticulo("Camisa", ""), "");
});
