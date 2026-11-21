import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/authHook";

export default function useRole() {

  const { user } = useAuth();

  const [roleResult, setRoleResult] = useState({
    userId: null,
    role: null,
  });

  useEffect(() => {
    if (!user) return;

    async function obtenerRol() {

      const { data, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        console.error(error);
      }

      setRoleResult({
        userId: user.id,
        role: data?.rol ?? null,
      });
    }

    obtenerRol();

  }, [user]);

  const isCurrentUser = roleResult.userId === user?.id;

  return {
    role: isCurrentUser ? roleResult.role : null,
    loading: Boolean(user) && !isCurrentUser
  };
}