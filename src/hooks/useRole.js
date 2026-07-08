import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function useRole() {

  const { user } = useAuth();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user) {
      setLoading(false);
      return;
    }

    async function obtenerRol() {

      const { data, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        console.error(error);
      }

      setRole(data?.rol ?? null);
      setLoading(false);
    }

    obtenerRol();

  }, [user]);

  return {
    role,
    loading
  };
}