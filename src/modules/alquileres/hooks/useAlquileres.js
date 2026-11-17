// src/modules/alquileres/hooks/useAlquileres.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerAlquileres, crearAlquiler, devolverAlquiler } from "../services/alquileres.service";

export function useAlquileres() {
    const queryClient = useQueryClient();

    const alquileresQuery = useQuery({
        queryKey: ["alquileres"],
        queryFn: obtenerAlquileres,
    });

    const crearMutation = useMutation({
        mutationFn: crearAlquiler,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alquileres"] });
            queryClient.invalidateQueries({ queryKey: ["articulos-selector"] });
            queryClient.invalidateQueries({ queryKey: ["movimientos"] });
        },
    });

    const devolverMutation = useMutation({
        mutationFn: (data) => devolverAlquiler(data.id, data.usuarioId, data.detallesDevolucion), // ⬅️ Actualizado
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alquileres"] });
            queryClient.invalidateQueries({ queryKey: ["articulos-selector"] });
            queryClient.invalidateQueries({ queryKey: ["movimientos"] });
        },
    });

    return {
        alquileres: alquileresQuery.data || [],
        isLoading: alquileresQuery.isLoading,
        crear: crearMutation.mutateAsync,
        isCreando: crearMutation.isPending,
        devolver: devolverMutation.mutateAsync,
        isDevolviendo: devolverMutation.isPending,
    };
}