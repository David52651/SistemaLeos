import { afterEach, describe, expect, it, vi } from "vitest";
import { exportToCSV } from "@/utils/exportToCSV";

describe("exportación CSV", () => {
  let originalCreateObjectURL;
  let originalRevokeObjectURL;

  afterEach(() => {
    if (originalCreateObjectURL) {
      URL.createObjectURL = originalCreateObjectURL;
    } else {
      delete URL.createObjectURL;
    }

    if (originalRevokeObjectURL) {
      URL.revokeObjectURL = originalRevokeObjectURL;
    } else {
      delete URL.revokeObjectURL;
    }

    vi.restoreAllMocks();
  });

  it("descarga un CSV con BOM y escapes de comillas", async () => {
    let archivo;
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn((blob) => {
      archivo = blob;
      return "blob:test";
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    exportToCSV(
      [{ nombre: 'Vestido "Rojo"' }],
      [{ key: "nombre", title: "Artículo" }],
      "inventario"
    );

    const bytes = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(archivo);
    });
    const contenido = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(archivo);
    });

    expect(contenido).toContain('"Artículo"');
    expect(contenido).toContain('"Vestido ""Rojo"""');
    expect([...new Uint8Array(bytes).slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    expect(click).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("no intenta descargar cuando no hay datos", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    exportToCSV([], [{ key: "nombre", title: "Artículo" }]);

    expect(warning).toHaveBeenCalledWith("No hay datos para exportar");
  });
});
