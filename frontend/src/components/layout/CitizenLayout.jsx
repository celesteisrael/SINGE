import React from 'react';
import { AuthenticatedLayout } from './AuthenticatedLayout';

const NAVIGATION = [
  { id: 'dashboard', label: 'Início', icon: 'Home' },
  { id: 'comunicar', label: 'Comunicar ocorrência', icon: 'AlertCircle' },
  { id: 'minhas-ocorrencias', label: 'As minhas ocorrências', icon: 'FileText' },
  { id: 'verificacao', label: 'Verificação de identidade', icon: 'ShieldCheck' },
  { id: 'alertas', label: 'Alertas públicos', icon: 'AlertOctagon' },
  { id: 'informacoes', label: 'Segurança e recomendações', icon: 'BookOpen' },
  { id: 'notificacoes', label: 'Notificações', icon: 'Bell' },
  { id: 'perfil', label: 'O meu perfil', icon: 'User' },
];

export function CitizenLayout({ user, page, setPage, onLogout, availablePages = [], children }) {
  const navigation = NAVIGATION.filter(item => availablePages.includes(item.id));
  return <AuthenticatedLayout
    user={user}
    onLogout={onLogout}
    navigation={navigation}
    activePage={page === 'detalhe-cidadao' ? 'minhas-ocorrencias' : page === 'detalhe-alerta' ? 'alertas' : page}
    onNavigate={setPage}
    title={navigation.find(item => item.id === page)?.label || 'Acompanhar ocorrência'}
  >{children}</AuthenticatedLayout>;
}

export default CitizenLayout;
