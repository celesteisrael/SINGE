import React from 'react';
import Icon from '../../components/common/Icon';
import { Card, StatCard, StatusBadge } from '../../components/common/CommonComponents';
import { MozambiqueMap } from '../../components/map/MapComponents';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function OperadorDashboard({
  user,
  ocorrencias = [],
  estatisticas = {},
  identidadeStats,
  identidadeStatsError,
  loading,
  error,
  onRefresh,
  onSelect,
  setPage,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold uppercase tracking-wider">
            Central de Atendimento e Triagem
          </span>
          <h1 className="text-2xl font-bold text-ink dark:text-dink mt-2">Painel do Operador</h1>
          <p className="text-sm text-muted dark:text-dmuted mt-1">
            Olá, {user.name}. Consulte as ocorrências e registe a validação inicial.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Actualizar painel"
          className="p-2 rounded-lg border border-bd dark:border-dborder text-ink dark:text-dink disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        <StatCard icon="FileText" label="Total de ocorrências" value={loading ? '…' : (estatisticas.total ?? 0)} tone="brand" />
        <StatCard icon="Clock" label="Pendentes de análise" value={loading ? '…' : (estatisticas.pendentes_analise ?? 0)} tone="orange" />
        <StatCard icon="CheckCircle" label="Validadas" value={loading ? '…' : (estatisticas.validadas ?? 0)} tone="green" />
        <StatCard icon="AlertTriangle" label="Não confirmadas" value={loading ? '…' : (estatisticas.nao_confirmadas ?? 0)} tone="orange" />
        <StatCard icon="XCircle" label="Rejeitadas" value={loading ? '…' : (estatisticas.rejeitadas ?? 0)} tone="red" />
        <StatCard icon="ShieldCheck" label="Identidades por analisar" value={identidadeStats ? (identidadeStats.pendentes + identidadeStats.em_analise) : '…'} hint={identidadeStats ? `${identidadeStats.aprovadas} aprovadas · ${identidadeStats.rejeitadas} rejeitadas` : (identidadeStatsError || 'A carregar pedidos')} tone="brand" />
        <StatCard icon="Copy" label="Duplicadas" value={loading ? '…' : (estatisticas.duplicadas ?? 0)} tone="brand" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5"><h2 className="mb-3 font-semibold">Registos de ocorrências · últimos 14 dias</h2>{loading ? <p role="status" className="text-sm text-muted">A carregar…</p> : !(estatisticas.evolucao_14_dias || []).length ? <p className="text-sm text-muted">Sem registos neste período.</p> : <div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={estatisticas.evolucao_14_dias}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>}</Card>
        <Card className="p-5"><h2 className="mb-3 font-semibold">Ocorrências por tipo</h2>{loading ? <p role="status" className="text-sm text-muted">A carregar…</p> : !(estatisticas.por_tipo || []).some(item => Number(item.total)) ? <p className="text-sm text-muted">Sem ocorrências por classificar.</p> : <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={estatisticas.por_tipo.filter(item => Number(item.total) > 0)}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="nome" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#0f766e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>}</Card>
        <Card className="p-5"><h2 className="mb-3 font-semibold">Estado da validação mais recente</h2>{loading ? <p role="status" className="text-sm text-muted">A carregar…</p> : !Object.keys(estatisticas.por_estado_validacao || {}).length ? <p className="text-sm text-muted">Ainda não foram registadas validações.</p> : <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={Object.entries(estatisticas.por_estado_validacao).map(([estado, total]) => ({ estado: estado.replaceAll('_', ' '), total: Number(total) }))}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="estado" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#ea580c" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>}</Card>
        <Card className="p-5"><h2 className="mb-3 font-semibold">Localização das ocorrências recentes</h2>{ocorrencias.some(item => item.latitude != null || item.localizacao_geografica?.latitude != null) ? <MozambiqueMap ocorrencias={ocorrencias} height={220} onSelectOccurrence={item => onSelect(item.id)} /> : <p className="mb-3 text-sm text-muted">As ocorrências recentes ainda não têm coordenadas verificadas.</p>}{(estatisticas.por_provincia || []).length > 0 && <div className="mt-3 h-40"><p className="mb-2 text-xs text-muted">Ocorrências por província</p><ResponsiveContainer width="100%" height="100%"><BarChart data={estatisticas.por_provincia}><XAxis dataKey="nome" tick={{ fontSize: 9 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>}</Card>
      </div>

      <Card>
        <div className="p-5 border-b border-bd dark:border-dborder flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink dark:text-dink">Ocorrências recentes</h2>
            <p className="text-xs text-muted dark:text-dmuted mt-1">Ordenadas pela data de registo na API.</p>
          </div>
          <button
            type="button"
            onClick={() => setPage('ocorrencias')}
            className="text-xs text-brand dark:text-dblue hover:underline flex items-center gap-1 font-medium"
          >
            Abrir lista <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        {error ? (
          <div className="p-5" role="alert">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button type="button" onClick={onRefresh} className="mt-2 text-sm text-brand underline">Tentar novamente</button>
          </div>
        ) : loading ? (
          <p className="p-5 text-sm text-muted dark:text-dmuted">A carregar dados do servidor…</p>
        ) : ocorrencias.length === 0 ? (
          <p className="p-5 text-sm text-muted dark:text-dmuted">Não existem ocorrências registadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-light dark:bg-dsidebar/50 text-xs uppercase text-muted dark:text-dmuted">
                <tr>
                  {['ID', 'Tipo', 'Localização', 'Data/hora', 'Estado', ''].map(heading => (
                    <th key={heading} className="text-left px-4 py-3 font-medium whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-bd dark:divide-dborder">
                {ocorrencias.slice(0, 5).map(occurrence => (
                  <tr key={occurrence.id} className="hover:bg-light dark:hover:bg-dsidebar/30">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-ink dark:text-dink">#{occurrence.id}</td>
                    <td className="px-4 py-3 text-ink dark:text-dink">{occurrence.tipo_ocorrencia?.nome || '—'}</td>
                    <td className="px-4 py-3 text-muted dark:text-dmuted">
                      {[occurrence.localizacao_geografica?.distrito, occurrence.localizacao_geografica?.provincia]
                        .filter(Boolean).join(', ') || occurrence.localizacao || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted dark:text-dmuted whitespace-nowrap">{formatDate(occurrence.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge s={STATE_LABELS[occurrence.estado] || occurrence.estado} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelect(occurrence.id)}
                        aria-label={`Consultar ocorrência ${occurrence.id}`}
                        className="p-1.5 rounded text-brand dark:text-dblue"
                      >
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

export default OperadorDashboard;
