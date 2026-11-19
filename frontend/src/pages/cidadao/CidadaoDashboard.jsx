import React from 'react';
import Icon from '../../components/common/Icon';
import { Card, StatCard, StatusBadge } from '../../components/common/CommonComponents';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  const stateChart = Object.entries(statistics.por_estado || {}).map(([name, value]) => ({ name: STATE_LABELS[name] || name, value: Number(value) }));
  const trend = statistics.evolucao_14_dias || [];
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="FileText" label="Total registadas" value={loading ? '…' : statistics.total} tone="brand" />
        <StatCard icon="Clock" label="Em acompanhamento" value={loading ? '…' : statistics.em_acompanhamento} tone="orange" />
        <StatCard icon="CheckCircle" label="Resolvidas" value={loading ? '…' : statistics.resolvidas} tone="green" />
        <StatCard icon="Bell" label="Notificações não lidas" value={unreadNotifications} tone="red" />
        <StatCard icon="ShieldCheck" label="Identidade" value={identityApproved ? 'Aprovada' : 'Pendente'} tone={identityApproved ? 'green' : 'orange'} />
      </div>

      <Card className="p-6 md:p-8 bg-navy border-0 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px]">
            <h2 className="text-xl md:text-2xl font-bold">Identificou uma situação de emergência?</h2>
            <p className="text-white/75 mt-2 text-sm max-w-lg">
              {identityApproved ? 'Registe a comunicação para análise pelas entidades responsáveis. A prioridade será atribuída durante a triagem oficial.' : 'A verificação de identidade aprovada é necessária para registar uma ocorrência pela sua conta.'}
            </p>
          </div>
          <button
            onClick={() => setPage(identityApproved ? 'comunicar' : 'verificacao')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy font-bold text-sm hover:bg-white/90 transition-all shadow-lg"
          >
            <Icon name="AlertCircle" size={20} className="text-red-600" />
            <span>{identityApproved ? 'COMUNICAR OCORRÊNCIA' : 'VERIFICAR IDENTIDADE'}</span>
          </button>
        </div>
      </Card>

      <div className="flex gap-3 p-4 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <Icon name="Info" size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900 dark:text-amber-100">
          <strong>Em caso de perigo imediato,</strong> procure um local seguro e contacte os serviços de emergência competentes.
          O registo na plataforma não garante assistência imediata.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5"><h3 className="mb-3 font-semibold text-ink dark:text-dink">As minhas ocorrências por estado</h3>{loading ? <p role="status" className="text-sm text-muted">A carregar dados…</p> : stateChart.length === 0 ? <p className="text-sm text-muted">Ainda não há dados para apresentar.</p> : <div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={stateChart} dataKey="value" nameKey="name" outerRadius={80} label>{stateChart.map((item, index) => <Cell key={item.name} fill={['#2563eb', '#d97706', '#16a34a', '#64748b', '#dc2626'][index % 5]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>}</Card>
        <Card className="p-5"><h3 className="mb-3 font-semibold text-ink dark:text-dink">Evolução das minhas comunicações · 14 dias</h3>{loading ? <p role="status" className="text-sm text-muted">A carregar dados…</p> : trend.length === 0 ? <p className="text-sm text-muted">Ainda não há comunicações neste período.</p> : <div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>}</Card>
        <Card className="p-5"><h3 className="mb-3 font-semibold text-ink dark:text-dink">Verificação de identidade</h3><p className="text-sm">{identityApproved ? 'A identidade está aprovada e já pode comunicar ocorrências.' : 'A submissão e acompanhamento do pedido estão disponíveis na área de verificação.'}</p><button className="mt-3 text-sm font-semibold text-brand underline" onClick={() => setPage('verificacao')}>Consultar estado do pedido</button></Card>
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
