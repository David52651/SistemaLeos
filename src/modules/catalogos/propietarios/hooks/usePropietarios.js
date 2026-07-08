import { useQuery } from "@tanstack/react-query";

import {
  getPropietarios,
} from "../services/propietarios.service";

export function usePropietarios() {

  return useQuery({

    queryKey: ["propietarios"],

    queryFn: getPropietarios,

  });

}