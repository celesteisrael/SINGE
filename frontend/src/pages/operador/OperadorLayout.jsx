import React from 'react';
import { AuthenticatedLayout } from '../../components/layout/AuthenticatedLayout';

const NAVIGATION = [
  { id: 'dashboard', label: 'Painel de triagem', icon: 'LayoutDashboard' },
  { id: 'ocorrencias', label: 'Ocorrências', icon: 'FileText' },
  { id: 'registar', label: 'Registar ocorrência', icon: 'PlusCircle' },
  { id: 'identidade', label: 'Verificar identidade', icon: 'ShieldCheck' },
  { id: 'avisos', label: 'Notificações e alertas', icon: 'Bell' },
];

export function OperadorLayout({ user, page, setPage, onLogout, children }) {
  const activePage = page === 'detalhe-ocorrencia' ? 'ocorrencias' : page;
  return <AuthenticatedLayout
    user={user}
    onLogout={onLogout}
    navigation={NAVIGATION}
    activePage={activePage}
    onNavigate={setPage}
    title={NAVIGATION.find(item => item.id === activePage)?.label || 'Painel do Operador'}
  >{children}</AuthenticatedLayout>;
}

export default OperadorLayout;
