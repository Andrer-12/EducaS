import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Sidebar() {
  const { role } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-[#042D2D] text-white p-6 flex flex-col h-screen shadow-lg">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white tracking-wider">EducaS</h1>
        <p className="text-xs text-[#2EB8B8] uppercase mt-1 tracking-widest">{role || '...'}</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link to="/" className="block py-2.5 px-4 rounded hover:bg-[#064242]">Dashboard</Link>
        {role === 'Diretor' && <Link to="/financeiro" className="block py-2.5 px-4 rounded hover:bg-[#064242]">Relatórios</Link>}
        {role === 'Coordenador' && <Link to="/turmas" className="block py-2.5 px-4 rounded hover:bg-[#064242]">Turmas</Link>}
        {role === 'Professor' && <Link to="/diarios" className="block py-2.5 px-4 rounded hover:bg-[#064242]">Diários</Link>}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto pt-4 border-t border-[#064242] w-full text-left text-sm text-gray-400 hover:text-white"
      >
        Sair
      </button>
    </aside>
  );
}