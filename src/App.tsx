import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import ProfileGate from './components/auth/ProfileGate';
import Financeiro from './pages/Financeiro';
import Turmas from './pages/Turmas';
import Diarios from './pages/Diarios';

export default function App() {
  const { session } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={!session ? <LoginForm /> : <Navigate to="/" />} />
        
        {/* Rota Raiz (Dashboard Principal) */}
        <Route path="/" element={
          session ? (
            <DashboardLayout>
              <ProfileGate>
                <Dashboard />
              </ProfileGate>
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        {/* Redirecionamento para evitar erros de digitação na URL */}
        <Route path="/dashboard" element={<Navigate to="/" />} />

        {/* Rotas Protegidas com Filtro de Cargo */}
        <Route path="/financeiro" element={
          session ? (
            <DashboardLayout>
              <ProfileGate allowedRoles={['Diretor']}>
                <Financeiro />
              </ProfileGate>
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/turmas" element={
          session ? (
            <DashboardLayout>
              <ProfileGate allowedRoles={['Diretor', 'Coordenador']}>
                <Turmas />
              </ProfileGate>
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/diarios" element={
          session ? (
            <DashboardLayout>
              <ProfileGate allowedRoles={['Diretor', 'Professor']}>
                <Diarios />
              </ProfileGate>
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}