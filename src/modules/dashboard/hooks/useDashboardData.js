import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useDashboardData() {
    // 1. Traer artículos (para stock y distribución)
    const articulosQuery = useQuery({
        queryKey: ["dashboard-articulos"],
        queryFn: async () => {
            const { data, error } = await supabase.from("articulos").select("*");
            if (error) throw error;
            return data;
        },
    });

    // 2. Traer alquileres (para activos, retrasos y gráfico de área)
    const alquileresQuery = useQuery({
        queryKey: ["dashboard-alquileres"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("alquileres")
                .select("*")
                .order("fecha_salida", { ascending: true });
            if (error) throw error;
            return data;
        },
    });

    // 3. Traer los últimos movimientos y pérdidas del mes
    const movimientosQuery = useQuery({
        queryKey: ["dashboard-movimientos"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("movimientos_inventario")
                .select(`
                    *,
                    articulos ( codigo, nombre ),
                    usuarios ( nombre_completo )
                `)
                .order("fecha_movimiento", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const isLoading = articulosQuery.isLoading || alquileresQuery.isLoading || movimientosQuery.isLoading;

    const data = useMemo(() => {
        const articulos = articulosQuery.data || [];
        const alquileres = alquileresQuery.data || [];
        const movimientos = movimientosQuery.data || [];

        const hoy = new Date();
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        // ----- 1. MÉTRICAS PRINCIPALES -----
        const totalArticulos = articulos.length;
        
        const alquileresActivos = alquileres.filter(a => a.estado === "Activo").length;
        
        const alquileresRetrasados = alquileres.filter(a => 
            a.estado === "Activo" && new Date(a.fecha_devolucion_pactada) < hoy
        ).length;

        const stockPerdidoMes = movimientos
            .filter(m => m.tipo_movimiento === "Desechar" && new Date(m.fecha_movimiento) >= primerDiaMes)
            .reduce((sum, m) => sum + m.cantidad, 0);

        // ----- 2. DISTRIBUCIÓN DE INVENTARIO (Gráfico Torta) -----
        let disponibles = 0;
        let bajos = 0;
        let agotados = 0;

        articulos.forEach(art => {
            if (art.stock_actual === 0) agotados++;
            else if (art.stock_actual <= art.stock_min) bajos++;
            else disponibles++;
        });

        const datosTorta = [
            { name: "Disponibles", value: disponibles, color: "#22C55E" },
            { name: "Stock Bajo", value: bajos, color: "#EFB810" },
            { name: "Agotados", value: agotados, color: "#ED2100" },
        ].filter(d => d.value > 0); // Ocultar los que están en 0

        // ----- 3. ALQUILERES POR MES (Gráfico Área) -----
        // Agrupamos los alquileres de los últimos 6 meses
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const datosAreaMap = {};

        // Inicializar últimos 6 meses en 0
        for (let i = 5; i >= 0; i--) {
            const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
            const key = `${meses[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
            datosAreaMap[key] = 0;
        }

        alquileres.forEach(alq => {
            const fecha = new Date(alq.fecha_salida);
            const key = `${meses[fecha.getMonth()]} ${fecha.getFullYear().toString().slice(2)}`;
            if (datosAreaMap[key] !== undefined) {
                datosAreaMap[key]++;
            }
        });

        const datosArea = Object.keys(datosAreaMap).map(key => ({
            mes: key,
            alquileres: datosAreaMap[key]
        }));

        // ----- 4. ÚLTIMOS 5 MOVIMIENTOS -----
        const ultimosMovimientos = movimientos.slice(0, 5);

        return {
            totalArticulos,
            alquileresActivos,
            alquileresRetrasados,
            stockPerdidoMes,
            datosTorta,
            datosArea,
            ultimosMovimientos
        };

    }, [articulosQuery.data, alquileresQuery.data, movimientosQuery.data]);

    return {
        ...data,
        isLoading,
        hayRetrasos: data.alquileresRetrasados > 0
    };
}