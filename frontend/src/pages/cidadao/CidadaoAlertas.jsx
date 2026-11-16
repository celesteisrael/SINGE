import React, { useMemo, useState } from 'react';
import { Card, EmptyState, inputCls } from '../../components/common/CommonComponents';

const severityLabel = {
  critica: 'CRÍTICA',
  alta: 'ALTA',
  media: 'MÉDIA',
  baixa: 'BAIXA',
  informativa: 'INFORMAÇÃO',
};
const severityClass = {
  critica: 'bg-red-700',
  alta: 'bg-orange-600',
  media: 'bg-yellow-600',
  baixa: 'bg-blue-700',
  informativa: 'bg-slate-600',
};

export function CidadaoAlertas({ alertas = [], loading = false, error = '', onRefresh, setPage, setSelectedAlerta }) {
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const types = useMemo(() => [...new Set(alertas.map(alert => alert.tipo_perigo))], [alertas]);
  const filtered = alertas.filter(alert => (!type || alert.tipo_perigo === type)
    && (!severity || alert.severidade === severity));

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-ink dark:text-dink">Alertas públicos</h1>
        <p className="mt-1 text-sm text-muted dark:text-dmuted">Alertas publicados por autoridades autorizadas. A relevância geográfica refere-se à área indicada, não à localização actual do cidadão.</p>
      </header>
      {error && <Card className="p-4 text-sm text-red-700" role="alert">{error}<button className="ml-3 underline" onClick={onRefresh}>Tentar novamente</button></Card>}
      <Card className="grid gap-3 p-4 md:grid-cols-2">
        <select className={inputCls} value={type} onChange={event => setType(event.target.value)}>
          <option value="">Todos os tipos de perigo</option>
          {types.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <select className={inputCls} value={severity} onChange={event => setSeverity(event.target.value)}>
          <option value="">Todas as severidades</option>
          {Object.entries(severityLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </Card>
      {loading ? <Card className="p-6 text-sm text-muted">A carregar alertas publicados…</Card>
        : filtered.length === 0 ? <Card><EmptyState icon="Bell" title="Não há alertas publicados para estes filtros." /></Card>
          : <div className="space-y-3">{filtered.map(alert => (
            <Card key={alert.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded px-2 py-1 text-xs font-bold text-white ${severityClass[alert.severidade] || severityClass.informativa}`}>
                  {severityLabel[alert.severidade] || alert.severidade}
                </span>
                <span className="text-xs text-muted">{alert.tipo_perigo}</span>
                {alert.estado === 'encerrado' && <span className="rounded bg-slate-200 px-2 py-1 text-xs">Encerrado</span>}
                {alert.estado === 'publicado' && !alert.activo && <span className="rounded bg-slate-200 px-2 py-1 text-xs">Fora do período de validade</span>}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-ink dark:text-dink">{alert.titulo}</h2>
              <p className="mt-1 text-sm text-muted dark:text-dmuted">
                Área: {alert.area_geografica || [alert.localizacao?.provincia, alert.localizacao?.distrito].filter(Boolean).join(', ') || 'Não indicada'}
                {' · '}Publicado: {alert.data_publicacao ? new Date(alert.data_publicacao).toLocaleString() : '—'}
              </p>
              <p className="mt-3 text-sm text-ink dark:text-dink">{alert.descricao}</p>
              <div className="mt-3 rounded-lg bg-lblue p-3 text-sm dark:bg-dblue/10"><strong>Recomendações:</strong> {alert.recomendacoes}</div>
              <p className="mt-3 text-xs text-muted">Fonte: {alert.fonte}</p>
              <button className="mt-2 text-sm font-medium text-brand hover:underline" onClick={() => { setSelectedAlerta(alert); setPage('detalhe-alerta'); }}>Ver detalhe</button>
            </Card>
          ))}</div>}
    </div>
  );
}

export default CidadaoAlertas;
