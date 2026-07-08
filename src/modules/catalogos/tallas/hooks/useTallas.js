import { useQuery } from "@tanstack/react-query";

import {
  getTallas,
} from "../services/tallas.service";

export function useTallas() {

  return useQuery({

    queryKey: ["tallas"],

    queryFn: getTallas,

  });

}