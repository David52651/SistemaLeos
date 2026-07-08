const CONECTORES = [
  "de",
  "del",
  "la",
  "las",
  "el",
  "los",
  "con",
  "sin",
  "y",
  "a",
  "e",
  "u",
  "i",
  "o",
  "en",
];

export function generarCodigoArticulo(
  nombre,
  talla
) {

  if (!nombre || !talla) {
    return "";
  }

  const partes = nombre
    .trim()
    .toUpperCase()
    .split(" ")
    .filter(
      palabra =>
        !CONECTORES.includes(
          palabra.toLowerCase()
        )
    )
    .map(
      palabra =>
        palabra.substring(0, 3)
    );

  return `${partes.join("-")}-${talla}`;
}