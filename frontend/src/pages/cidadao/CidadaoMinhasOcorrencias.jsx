import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, Button, StatusBadge, EmptyState, inputCls } from '../../components/common/CommonComponents';

const STATES = [
  ['registada', 'Registada'],
  ['em_avaliacao', 'Em avaliação'],
  ['em_atendimento', 'Em atendimento'],
  ['resolvida', 'Resolvida'],
  ['cancelada', 'Cancelada'],
];

const STATE_LABELS = Object.fromEntries(STATES);

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function CidadaoMinhasOcorrencias({
  ocorrencias = [],
  pagination,
  filters,
  types = [],
  loading,
  error,
  onRefresh,
  onFiltersChange,
  onSelect,
  setPage,
}) {
  const [query, setQuery] = useState('');
  const filtered = ocorrencias.filter(occurrence => (
    !query
    || String(occurrence.id).includes(query.trim())
    || occurrence.titulo?.toLowerCase().includes(query.trim().toLowerCase())
  ));

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-dink">As Minhas Ocorrências</h1>
          <p className="text-sm text-muted dark:text-dmuted mt-1">Registos associados à sua conta.</p>
        </div>
        <Button icon="PlusCircle" onClick={() => setPage('comunicar')}>Nova ocorrência</Button>
      </div>

      <Card className="p-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dmuted pointer-events-none" />
            <input
              aria-label="Pesquisar ocorrências"
              placeholder="Pesquisar identificador ou título…"
              value={query}
              onChange={event => setQuery(event.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            aria-label="Filtrar por tipo"
            value={filters.tipo_ocorrencia_id}
            onChange={event => onFiltersChange({ tipo_ocorrencia_id: event.target.value })}
            className={inputCls}
          >
            <option value="">Todos os tipos</option>
            {types.map(type => <option key={type.id} value={type.id}>{type.nome}</option>)}
          </select>
          <select
            aria-label="Filtrar por estado"
            value={filters.estado}
            onChange={event => onFiltersChange({ estado: event.target.value })}
            className={inputCls}
          >
            <option value="">Todos os estados</option>
            {STATES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </Card>

      {error ? (
        <Card className="p-5" role="alert">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button onClick={onRefresh} className="mt-2 text-sm text-brand underline">Tentar novamente</button>
        </Card>
      ) : loading ? (
        <Card className="p-5 text-sm text-muted dark:text-dmuted">A carregar as suas ocorrências…</Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="FileText"
            title={query || filters.estado || filters.tipo_ocorrencia_id ? 'Nenhuma ocorrência corresponde aos filtros.' : 'Ainda não comunicou nenhuma ocorrência.'}
            description={query || filters.estado || filters.tipo_ocorrencia_id ? 'Altere os filtros e tente novamente.' : 'Quando registar uma ocorrência, ela aparecerá aqui.'}
            action={!query && !filters.estado && !filters.tipo_ocorrencia_id
              ? <Button icon="PlusCircle" onClick={() => setPage('comunicar')}>Comunicar uma ocorrência</Button>
              : undefined}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-light dark:bg-dsidebar/50 text-xs uppercase text-muted dark:text-dmuted">
                <tr>
                  {['Identificador', 'Tipo', 'Localização', 'Data', 'Estado', ''].map(heading => (
                    <th key={heading} className="text-left px-4 py-3 font-medium whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-bd dark:divide-dborder">
                {filtered.map(occurrence => (
                  <tr key={occurrence.id} data-testid="cid-oc-item" data-ref={occurrence.id} className="hover:bg-light dark:hover:bg-dsidebar/30">
                    <td className="px-4 py-3 font-medium text-ink dark:text-dink whitespace-nowrap">#{occurrence.id}</td>
                    <td className="px-4 py-3 text-ink dark:text-dink">{occurrence.tipo_ocorrencia?.nome || '—'}</td>
                    <td className="px-4 py-3 text-muted dark:text-dmuted">{occurrence.localizacao}</td>
                    <td className="px-4 py-3 text-muted dark:text-dmuted whitespace-nowrap">{formatDate(occurrence.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge s={STATE_LABELS[occurrence.estado] || occurrence.estado} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => onSelect(occurrence.id)} className="text-brand dark:text-dblue hover:bg-lblue dark:hover:bg-dsidebar p-1.5 rounded" title="Consultar">
                        <Icon name="Eye" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-bd dark:border-dborder text-sm">
            <span className="text-muted dark:text-dmuted">
              Página {pagination?.current_page || 1} de {pagination?.last_page || 1} · {pagination?.total || 0} registo(s)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pagination || pagination.current_page <= 1}
                onClick={() => onFiltersChange({ page: pagination.current_page - 1 })}
                className="rounded border border-bd dark:border-dborder px-3 py-1 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={!pagination || pagination.current_page >= pagination.last_page}
                onClick={() => onFiltersChange({ page: pagination.current_page + 1 })}
                className="rounded border border-bd dark:border-dborder px-3 py-1 disabled:opacity-50"
              >
                Seguinte
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default CidadaoMinhasOcorrencias;
