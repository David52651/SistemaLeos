import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { from } = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock("@/lib/supabase", () => ({
  supabase: { from },
}));

import { useDashboardData } from "@/modules/dashboard/hooks/useDashboardData";

function makeQuery(result) {
  const query = {
    order: vi.fn(() => Promise.resolve(result)),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };
  return query;
}

describe("datos del Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const articles = [
      { stock_actual: 5, stock_min: 2 },
      { stock_actual: 1, stock_min: 1 },
      { stock_actual: 0, stock_min: 0 },
    ];
    const rentals = [
      { estado: "Activo", fecha_devolucion_pactada: yesterday, fecha_salida: now.toISOString() },
      { estado: "Activo", fecha_devolucion_pactada: tomorrow, fecha_salida: now.toISOString() },
      { estado: "Devuelto", fecha_devolucion_pactada: yesterday, fecha_salida: now.toISOString() },
    ];
    const movements = [
      { tipo_movimiento: "Desechar", cantidad: 2, fecha_movimiento: now.toISOString() },
      { tipo_movimiento: "Desechar", cantidad: 1, fecha_movimiento: now.toISOString() },
      ...Array.from({ length: 5 }, (_, index) => ({
        tipo_movimiento: "Agregar",
        cantidad: 1,
        fecha_movimiento: new Date(now.getTime() - (index + 1) * 1000).toISOString(),
      })),
    ];
    const results = {
      articulos: { data: articles, error: null },
      alquileres: { data: rentals, error: null },
      movimientos_inventario: { data: movements, error: null },
    };

    from.mockImplementation((table) => ({
      select: vi.fn(() => makeQuery(results[table])),
    }));
  });

  it("calcula métricas de inventario, alquileres y movimientos", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalArticulos).toBe(3);
    expect(result.current.stockTotalUnidades).toBe(6);
    expect(result.current.alquileresActivos).toBe(2);
    expect(result.current.alquileresRetrasados).toBe(1);
    expect(result.current.stockPerdidoMes).toBe(3);
    expect(result.current.hayRetrasos).toBe(true);
    expect(result.current.datosTorta.map(({ name, value }) => [name, value])).toEqual([
      ["Disponibles", 1],
      ["Stock Bajo", 1],
      ["Agotados", 1],
    ]);
    expect(result.current.datosArea).toHaveLength(6);
    expect(result.current.datosArea.at(-1).alquileres).toBe(3);
    expect(result.current.ultimosMovimientos).toHaveLength(5);

    queryClient.clear();
  });
});
