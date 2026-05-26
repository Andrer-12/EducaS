import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#042D2D]">Painel EducaS</h1>
          <p className="text-gray-500">Perfil: <span className="font-semibold text-[#2EB8B8]">{role || 'Carregando...'}</span></p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800">Bem-vindo ao sistema</h3>
          <p className="text-gray-600 mt-2">Esta é a área central do seu ecossistema.</p>
        </div>
      </div>
    </div>
  );
}