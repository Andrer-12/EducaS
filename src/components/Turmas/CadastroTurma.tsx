import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function CadastroTurma() {
  const { escolaId } = useAuth();
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de segurança
    if (!escolaId) {
      alert('Erro: Usuário não vinculado a uma escola.');
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.from('turmas').insert([
      { 
        nome, 
        ano_letivo: parseInt(ano), 
        escola_id: escolaId 
      }
    ]);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Turma criada com sucesso!');
      setNome('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="bg-slate-900 p-6 rounded-xl border border-slate-700">
      <h2 className="text-white text-lg font-bold mb-4">Cadastrar Nova Turma</h2>
      <input 
        className="w-full bg-slate-800 p-2 rounded text-white mb-3"
        placeholder="Nome da Turma (Ex: 9º Ano B)"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <button 
        disabled={loading}
        className="bg-emerald-600 text-white px-4 py-2 rounded font-bold w-full"
      >
        {loading ? 'Salvando...' : 'Salvar Turma'}
      </button>
    </form>
  );
}