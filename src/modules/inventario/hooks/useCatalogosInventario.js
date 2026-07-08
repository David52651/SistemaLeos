import { useQuery } from "@tanstack/react-query";
import { getDanzas,} from "@/modules/catalogos/danzas/services/danzas.service";

import {
  getCategoriasActivas,
  getTallasActivas,
  getPropietariosActivos,
} from "../services/catalogos.service";

export function useCatalogosInventario() {

  const categorias = useQuery({
    queryKey: ["categorias-activo"],
    queryFn: getCategoriasActivas,
  });

  const tallas = useQuery({
    queryKey: ["tallas-activo"],
    queryFn: getTallasActivas,
  });

  const propietarios = useQuery({
    queryKey: ["propietarios-activo"],
    queryFn: getPropietariosActivos,
  });

  const danzas = useQuery({
  queryKey: ["danzas"],
  queryFn: getDanzas,
});

return {
  categorias,
  tallas,
  propietarios,
  danzas,
};
}