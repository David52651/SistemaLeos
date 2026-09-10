import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    obtenerMovimientos, 
    obtenerArticulosActivos, 
    registrarMovimiento 
} from "../services/movimientos.service";

export function useMovimientos() {
    const queryClient = useQueryClient();

    // 1. Consulta para el historial de movimientos
    const movimientosQuery = useQuery({
        queryKey: ["movimientos"],
        queryFn: obtenerMovimientos,
    });

    // 2. Consulta para el selector de artículos activos
    const articulosQuery = useQuery({
        queryKey: ["articulos-selector"],
        queryFn: obtenerArticulosActivos,
    });

    // 3. Mutación para registrar un movimiento
    const registrarMutation = useMutation({
        mutationFn: registrarMovimiento,
        onSuccess: () => {
            // Refrescamos el historial de movimientos
            queryClient.invalidateQueries({ queryKey: ["movimientos"] });
            // Refrescamos el selector de artículos (por si cambió el stock)
            queryClient.invalidateQueries({ queryKey: ["articulos-selector"] });
            // Refrescamos el inventario general por si acaso
            queryClient.invalidateQueries({ queryKey: ["inventario"] });
        },
    });

    return {
        // Historial
        movimientos: movimientosQuery.data || [],
        isLoadingMovimientos: movimientosQuery.isLoading,
        errorMovimientos: movimientosQuery.error,
        refetchMovimientos: movimientosQuery.refetch,
        
        // Selector de artículos
        articulos: articulosQuery.data || [],
        isLoadingArticulos: articulosQuery.isLoading,
        
        // Acción de registrar
        registrar: registrarMutation.mutateAsync,
        isRegistrando: registrarMutation.isPending,
        errorRegistro: registrarMutation.error,
    };
}