import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProfileGateProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProfileGate({ children, allowedRoles }: ProfileGateProps) {
  const { role } = useAuth();

  // Se ainda estiver carregando, mostra algo amigável ou nada
  if (role === undefined) return <div>Carregando...</div>;

  // Se o usuário não tem cargo definido no banco, ele não deveria estar logado
  if (!role) {
    console.error("Usuário sem cargo definido no banco de dados.");
    return <Navigate to="/login" replace />; 
  }

  // Validação de acesso
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}