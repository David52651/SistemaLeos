import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarPerfil(userId) {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    setPerfil(data);
  }

  useEffect(() => {
    async function inicializar() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const usuario = session?.user ?? null;

      setUser(usuario);

      if (usuario) {
        await cargarPerfil(usuario.id);
      }

      setLoading(false);
    }

    inicializar();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {

          const usuario = session?.user ?? null;

          setUser(usuario);

          if (usuario) {
            await cargarPerfil(usuario.id);
          } else {
            setPerfil(null);
          }
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        loading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);