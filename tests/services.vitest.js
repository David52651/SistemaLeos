import { beforeEach, describe, expect, it, vi } from "vitest";

const { from, rpc } = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: { from, rpc },
}));

import { getArticulos } from "@/modules/inventario/services/inventario.service";
import { registrarMovimiento } from "@/modules/movimientos/services/movimientos.service";
import {
  crearAlquiler,
  devolverAlquiler,
} from "@/modules/alquileres/services/alquileres.service";

describe("servicios de inventario y movimientos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("selecciona la imagen principal del artículo", async () => {
    const articulos = [{
      id: "articulo-1",
      imagenes_articulo: [
        { url_imagen: "secundaria.jpg", principal: false },
        { url_imagen: "principal.jpg", principal: true },
      ],
    }];
    const order = vi.fn().mockResolvedValue({ data: articulos, error: null });
    from.mockReturnValue({
      select: vi.fn(() => ({ order })),
    });

    await expect(getArticulos()).resolves.toEqual([
      { ...articulos[0], imagen_url: "principal.jpg" },
    ]);
  });

  it("registra movimientos mediante el RPC y mapea sus parámetros", async () => {
    rpc.mockResolvedValue({ error: null });

    await expect(registrarMovimiento({
      articulo_id: "articulo-1",
      usuario_id: "usuario-1",
      tipo_movimiento: "Agregar",
      cantidad: 3,
      motivo: "Ingreso",
      detalles: null,
    })).resolves.toBe(true);

    expect(rpc).toHaveBeenCalledWith("registrar_movimiento_inventario", {
      p_articulo_id: "articulo-1",
      p_usuario_id: "usuario-1",
      p_tipo_movimiento: "Agregar",
      p_cantidad: 3,
      p_motivo: "Ingreso",
      p_movimiento: "Se agregaron 3 artículos",
      p_detalles: null,
    });
  });

  it("propaga errores del backend al registrar movimientos", async () => {
    rpc.mockResolvedValue({ error: { message: "Stock insuficiente" } });

    await expect(registrarMovimiento({
      tipo_movimiento: "Desechar",
      cantidad: 1,
    })).rejects.toThrow("Stock insuficiente");
  });
});

describe("servicio de alquileres", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rpc.mockResolvedValue({ data: "alquiler-1", error: null });
  });

  it("envía el carrito completo al RPC de creación", async () => {
    const payload = {
      usuario_id: "usuario-1",
      cliente_nombre: "Cliente de prueba",
      cliente_dni: "12345678",
      cliente_contacto: "999999999",
      cliente_direccion: "",
      tipo: "Paquete",
      fecha_devolucion_pactada: "2026-11-21",
      observaciones: "",
      detalles: [{ articulo_id: "articulo-1", cantidad: 2 }],
    };

    await expect(crearAlquiler(payload)).resolves.toBe("alquiler-1");

    expect(rpc).toHaveBeenCalledWith("crear_alquiler", {
      p_usuario_id: payload.usuario_id,
      p_cliente_nombre: payload.cliente_nombre,
      p_cliente_dni: payload.cliente_dni,
      p_cliente_contacto: payload.cliente_contacto,
      p_cliente_direccion: payload.cliente_direccion,
      p_tipo: payload.tipo,
      p_fecha_devolucion_pactada: payload.fecha_devolucion_pactada,
      p_observaciones: payload.observaciones,
      p_detalles: payload.detalles,
    });
  });

  it("envía las observaciones de retorno al RPC de devolución", async () => {
    const detalles = [{ articulo_id: "articulo-1", observacion_devolucion: "Limpio" }];

    await expect(devolverAlquiler("alquiler-1", "usuario-1", detalles)).resolves.toBe(true);

    expect(rpc).toHaveBeenCalledWith("devolver_alquiler", {
      p_alquiler_id: "alquiler-1",
      p_usuario_id: "usuario-1",
      p_detalles_devolucion: detalles,
    });
  });

  it("propaga errores del backend al crear alquileres", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "Sin stock" } });

    await expect(crearAlquiler({})).rejects.toThrow("Sin stock");
  });
});
