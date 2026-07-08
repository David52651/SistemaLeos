import { useQuery } from "@tanstack/react-query";

import {
  getArticulos,
} from "../services/inventario.service";

export function useInventario() {

  return useQuery({

    queryKey: ["articulos"],

    queryFn: getArticulos,

  });

}