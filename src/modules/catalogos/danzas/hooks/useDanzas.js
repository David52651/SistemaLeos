import { useQuery } from "@tanstack/react-query";

import {
  getDanzas,
} from "../services/danzas.service";

export function useDanzas() {

  return useQuery({

    queryKey: ["danzas"],

    queryFn: getDanzas,

  });

}