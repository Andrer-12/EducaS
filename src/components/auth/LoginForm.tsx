import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Tentando logar com:", email);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro no Login:", error.message);
      setError(error.message);
    } else {
      console.log("Login realizado com sucesso!");
      // O AuthContext vai detectar a mudança de sessão automaticamente
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
      <form 
        onSubmit={handleLogin} 
        className="w-full max-w-sm p-8 bg-slate-900 rounded-lg shadow-xl border border-slate-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-emerald-500 outline-none transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-emerald-500 outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 font-bold rounded transition disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}