import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  role: string | null;
  escolaId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  role: null,
  escolaId: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [escolaId, setEscolaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Pega a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // 2. Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setRole(null);
        setEscolaId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('user_role, escola_id')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setRole(data.user_role);
        setEscolaId(data.escola_id);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ session, role, escolaId, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook para facilitar o uso em qualquer componente
export const useAuth = () => useContext(AuthContext);