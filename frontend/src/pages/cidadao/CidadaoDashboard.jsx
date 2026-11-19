import React from 'react';
import Icon from '../../components/common/Icon';
import { Card, StatCard, StatusBadge } from '../../components/common/CommonComponents';

const STATE_LABELS = {
  registada: 'Registada',
  em_avaliacao: 'Em avaliação',
  em_atendimento: 'Em atendimento',
  resolvida: 'Resolvida',
  cancelada: 'Cancelada',
};

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium' }).format(date);
}

export function CidadaoDashboard({
  user,
  occurrences = [],
  statistics = { total: 0, em_acompanhamento: 0, resolvidas: 0 },
  loading,
  error,
  unreadNotifications = 0,
  identityStatus = null,
  onRefresh,
  onSelect,
  setPage,
}) {
    const identityApproved = Boolean(identityStatus?.elegivel);
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink dark:text-dink">Bem-vindo(a), {user.name}</h1>
          <p className="text-sm text-muted dark:text-dmuted mt-1">
            Acompanhe as comunicações registadas na sua conta.
          </p>
        </div>
        <button onClick={onRefresh} disabled={loading} className="p-2 rounded-lg border border-bd dark:border-dborder text-ink dark:text-dink disabled:opacity-50" aria-label="Actualizar painel">
          <Icon name="RefreshCw" size={18} />
        </button>
      </div>

      <div className="flex justify-end"><button onClick={() => setPage(identityApproved ? 'comunicar' : 'verificacao')} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white"><Icon name="AlertCircle" size={18} />Comunicar ocorrência</button></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon="FileText" label="Total registados" value={loading ? '…' : statistics.total} tone="brand" />
        <StatCard icon="Bell" label="Notificações não lidas" value={unreadNotifications} tone="orange" />
        <StatCard icon="ShieldCheck" label="Identidade" value={identityApproved ? 'Verificada' : 'Pendente'} tone={identityApproved ? 'green' : 'orange'} />
      </div>

      <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <Icon name="Info" size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900 dark:text-amber-100">
          <strong>Em caso de perigo imediato,</strong> procure um local seguro e contacte os serviços de emergência competentes.
          O registo na plataforma não garante assistência imediata.
        </p>
      </div>



      <Card>
        <div className="p-5 border-b border-bd dark:border-dborder flex items-center justify-between gap-3">
          <h3 className="font-semibold text-ink dark:text-dink">As minhas ocorrências recentes</h3>
          <button onClick={() => setPage('minhas-ocorrencias')} className="text-xs text-brand dark:text-dblue hover:underline flex items-center gap-1 font-medium">
            Ver todas <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        {error ? (
          <div className="p-5" role="alert">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button onClick={onRefresh} className="mt-2 text-sm text-brand underline">Tentar novamente</button>
          </div>
        ) : loading ? (
          <p className="p-5 text-sm text-muted dark:text-dmuted">A carregar ocorrências…</p>
        ) : occurrences.length === 0 ? (
          <div className="p-5 text-sm text-muted dark:text-dmuted">
            Ainda não existem ocorrências registadas na sua conta.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead className="bg-light dark:bg-dsidebar/50 text-xs uppercase text-muted dark:text-dmuted">
                <tr>
                  {['Identificador', 'Tipo', 'Localização', 'Data', 'Estado', ''].map(heading => (
                    <th key={heading} className="text-left px-4 py-3 font-medium whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-bd dark:divide-dborder">
                {occurrences.slice(0, 5).map(occurrence => (
                  <tr key={occurrence.id} className="hover:bg-light dark:hover:bg-dsidebar/30">
                    <td className="px-4 py-3 font-medium text-ink dark:text-dink">#{occurrence.id}</td>
                    <td className="px-4 py-3 text-ink dark:text-dink">{occurrence.tipo_ocorrencia?.nome || '—'}</td>
                    <td className="px-4 py-3 text-muted dark:text-dmuted">{occurrence.localizacao}</td>
                    <td className="px-4 py-3 text-muted dark:text-dmuted whitespace-nowrap">{formatDate(occurrence.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge s={STATE_LABELS[occurrence.estado] || occurrence.estado} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => onSelect(occurrence.id)} aria-label={`Consultar ocorrência ${occurrence.id}`} className="text-brand dark:text-dblue p-1.5 rounded">
                        <Icon name="Eye" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default CidadaoDashboard;
