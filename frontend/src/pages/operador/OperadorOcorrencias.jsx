import React, { useEffect, useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, StatusBadge, Pagination, EmptyState, inputCls } from '../../components/common/CommonComponents';

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
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function OperadorOcorrencias({
  ocorrencias = [],
  pagination,
  filters,
  types = [],
  loading,
  error,
  onRefresh,
  onFiltersChange,
  onSelect,
}) {
  const [query, setQuery] = useState(filters.q || '');

  useEffect(() => {
    setQuery(filters.q || '');
  }, [filters.q]);

  const submitSearch = (event) => {
    event.preventDefault();
    onFiltersChange({ q: query.trim(), page: 1 });
  };

  const setFilter = (key, value) => onFiltersChange({ [key]: value, page: 1 });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-dink">Ocorrências</h1>
          <p className="text-sm text-muted dark:text-dmuted mt-1">
            {pagination?.total ?? 0} registo(s) encontrados na base de dados.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Actualizar ocorrências"
          className="p-2 rounded-lg border border-bd dark:border-dborder text-ink dark:text-dink disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={18} />
        </button>
      </div>

      <Card className="p-4">
        <form onSubmit={submitSearch} className="grid md:grid-cols-3 xl:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dmuted pointer-events-none" />
            <input
              aria-label="Pesquisar ocorrências"
              placeholder="Pesquisar por identificador, título, descrição ou localização"
              value={query}
              onChange={event => setQuery(event.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            aria-label="Filtrar por estado"
            value={filters.estado || ''}
            onChange={event => setFilter('estado', event.target.value)}
            className={inputCls}
          >
            <option value="">Todos os estados</option>
            {STATES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select
            aria-label="Filtrar por tipo"
            value={filters.tipo_ocorrencia_id || ''}
            onChange={event => setFilter('tipo_ocorrencia_id', event.target.value)}
            className={inputCls}
          >
            <option value="">Todos os tipos</option>
            {types.map(type => <option key={type.id} value={type.id}>{type.nome}</option>)}
          </select>
          <input
            aria-label="Filtrar por província"
            placeholder="Província"
            value={filters.provincia || ''}
            onChange={event => setFilter('provincia', event.target.value)}
            className={inputCls}
          />
          <input
            aria-label="Filtrar por distrito"
            placeholder="Distrito"
            value={filters.distrito || ''}
            onChange={event => setFilter('distrito', event.target.value)}
            className={inputCls}
          />
          <input
            aria-label="Filtrar por localização"
            placeholder="Localização"
            value={filters.localizacao || ''}
            onChange={event => setFilter('localizacao', event.target.value)}
            className={inputCls}
          />
          <label className="text-xs text-muted dark:text-dmuted">
            Desde
            <input
              type="date"
              aria-label="Data inicial"
              value={filters.data_inicio || ''}
              onChange={event => setFilter('data_inicio', event.target.value)}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="text-xs text-muted dark:text-dmuted">
            Até
            <input
              type="date"
              aria-label="Data final"
              value={filters.data_fim || ''}
              onChange={event => setFilter('data_fim', event.target.value)}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="text-xs text-muted dark:text-dmuted">
            Ordenar por
            <select
              aria-label="Ordenar por"
              value={filters.ordenar_por || 'created_at'}
              onChange={event => setFilter('ordenar_por', event.target.value)}
              className={`${inputCls} mt-1`}
            >
              <option value="created_at">Data de registo</option>
              <option value="updated_at">Última actualização</option>
              <option value="id">Identificador</option>
            </select>
          </label>
          <label className="text-xs text-muted dark:text-dmuted">
            Ordem
            <select
              aria-label="Ordem"
              value={filters.ordem || 'desc'}
              onChange={event => setFilter('ordem', event.target.value)}
              className={`${inputCls} mt-1`}
            >
              <option value="desc">Mais recentes primeiro</option>
              <option value="asc">Mais antigos primeiro</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white">
              Pesquisar
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onFiltersChange({
                  q: '',
                  estado: '',
                  tipo_ocorrencia_id: '',
                  provincia: '',
                  distrito: '',
                  localizacao: '',
                  data_inicio: '',
                  data_fim: '',
                  ordenar_por: 'created_at',
                  ordem: 'desc',
                  page: 1,
                });
              }}
              className="rounded-lg border border-bd dark:border-dborder px-4 py-2 text-sm text-ink dark:text-dink"
            >
              Limpar
            </button>
          </div>
        </form>
      </Card>

      <Card>
        {error ? (
          <div className="p-5" role="alert">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button type="button" onClick={onRefresh} className="mt-2 text-sm text-brand underline">Tentar novamente</button>
          </div>
        ) : loading ? (
          <p className="p-5 text-sm text-muted dark:text-dmuted">A carregar ocorrências…</p>
        ) : ocorrencias.length === 0 ? (
          <EmptyState icon="FileText" title="Nenhuma ocorrência encontrada" description="Altere os filtros ou tente novamente." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[820px]">
                <thead className="bg-light dark:bg-dsidebar/50 text-xs uppercase text-muted dark:text-dmuted">
                  <tr>
                    {['ID', 'Tipo', 'Título e descrição', 'Localização', 'Data/hora', 'Estado', ''].map(heading => (
                      <th key={heading} className="text-left px-4 py-3 font-medium whitespace-nowrap">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd dark:divide-dborder">
                  {ocorrencias.map(occurrence => (
                    <tr key={occurrence.id} data-testid="operator-occurrence-row" className="hover:bg-light dark:hover:bg-dsidebar/30">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-ink dark:text-dink">#{occurrence.id}</td>
                      <td className="px-4 py-3 text-ink dark:text-dink">{occurrence.tipo_ocorrencia?.nome || '—'}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-ink dark:text-dink truncate">{occurrence.titulo}</p>
                        <p className="text-xs text-muted dark:text-dmuted truncate">{occurrence.descricao}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted dark:text-dmuted">
                        {[occurrence.localizacao_geografica?.distrito, occurrence.localizacao_geografica?.provincia]
                          .filter(Boolean).join(', ') || occurrence.localizacao || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted dark:text-dmuted whitespace-nowrap">{formatDate(occurrence.created_at)}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><StatusBadge s={STATE_LABELS[occurrence.estado] || occurrence.estado} /></td>
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
            <div className="p-4 border-t border-bd dark:border-dborder">
              <Pagination
                total={pagination?.total || 0}
                page={pagination?.current_page || 1}
                pageSize={pagination?.per_page || 15}
                onChange={page => onFiltersChange({ page })}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default OperadorOcorrencias;
