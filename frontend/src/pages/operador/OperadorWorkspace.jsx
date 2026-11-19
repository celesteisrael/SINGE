import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../components/common/CommonComponents';
import { useToast } from '../../contexts/ToastContext';
import { evidenciasService } from '../../services/evidenciasService';
import { ocorrenciasService } from '../../services/ocorrenciasService';
import { operadorService } from '../../services/operadorService';
import { alertasPublicosService } from '../../services/alertasPublicosService';
import { notificacoesService } from '../../services/notificacoesService';
import { DetalheOcorrencia } from './DetalheOcorrencia';
import { OperadorDashboard } from './OperadorDashboard';
import { OperadorLayout } from './OperadorLayout';
import { OperadorOcorrencias } from './OperadorOcorrencias';
import { RegistarOcorrencia } from './RegistarOcorrencia';
import { GestaoVerificacoesIdentidade } from '../admin/GestaoVerificacoesIdentidade';
import { identidadeService } from '../../services/identidadeService';

const EMPTY_RESULT = {
  items: [],
  pagination: { current_page: 1, per_page: 15, last_page: 1, total: 0 },
  estatisticas: {
    total: 0,
    pendentes_analise: 0,
    validadas: 0,
    nao_confirmadas: 0,
    rejeitadas: 0,
    duplicadas: 0,
  },
};

const INITIAL_FILTERS = {
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
  per_page: 15,
};

export function OperadorWorkspace({ user, onLogout }) {
  const toast = useToast();
  const [page, setPage] = useState('dashboard');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [types, setTypes] = useState([]);
  const [typesError, setTypesError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [occurrence, setOccurrence] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [notificacoes, setNotificacoes] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [avisosLoading, setAvisosLoading] = useState(false);
  const [avisosError, setAvisosError] = useState('');
  const [identidadeStats, setIdentidadeStats] = useState(null);
  const [identidadeStatsError, setIdentidadeStatsError] = useState('');

  const loadList = useCallback(async (query) => {
    setListLoading(true);
    setListError('');
    try {
      const response = await operadorService.listarOcorrencias(query);
      setResult(response);
    } catch (error) {
      setListError(error.message || 'Não foi possível carregar as ocorrências.');
    } finally {
      setListLoading(false);
    }
  }, []);

  const refreshList = useCallback(() => {
    const query = page === 'dashboard'
      ? { page: 1, per_page: 5, ordenar_por: 'created_at', ordem: 'desc' }
      : filters;
    return loadList(query);
  }, [filters, loadList, page]);

  const refreshDetail = useCallback(async () => {
    if (!selectedId) return;
    setDetailLoading(true);
    setDetailError('');
    try {
      setOccurrence(await ocorrenciasService.obterPorId(selectedId));
    } catch (error) {
      setOccurrence(null);
      setDetailError(error.message || 'Não foi possível carregar os detalhes da ocorrência.');
    } finally {
      setDetailLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    if (page === 'dashboard' || page === 'ocorrencias') refreshList();
  }, [page, filters, refreshList]);

  useEffect(() => {
    if (page === 'detalhe-ocorrencia' && selectedId) refreshDetail();
  }, [page, selectedId, refreshDetail]);

  useEffect(() => {
    let active = true;
    operadorService.listarTipos()
      .then(items => {
        if (active) setTypes(items);
      })
      .catch(error => {
        if (active) setTypesError(error.message || 'Não foi possível carregar os tipos de ocorrência.');
      });

    return () => {
      active = false;
    };
  }, []);

  const loadAvisos = useCallback(async () => {
    setAvisosLoading(true);
    setAvisosError('');
    try {
      const [privateItems, publicItems] = await Promise.all([
        notificacoesService.listar(),
        alertasPublicosService.listar(),
      ]);
      setNotificacoes(privateItems);
      setAlertas(publicItems);
    } catch (error) {
      setAvisosError(error.message || 'Não foi possível carregar os avisos.');
    } finally {
      setAvisosLoading(false);
    }
  }, []);

  useEffect(() => { if (page === 'avisos') loadAvisos(); }, [page, loadAvisos]);

  useEffect(() => {
    if (page !== 'dashboard') return;
    let active = true;
    setIdentidadeStatsError('');
    identidadeService.estatisticas()
      .then(stats => { if (active) setIdentidadeStats(stats); })
      .catch(error => { if (active) setIdentidadeStatsError(error.message || 'Não foi possível carregar os pedidos de identidade.'); });
    return () => { active = false; };
  }, [page]);

  const markNotificationRead = async id => {
    try {
      await notificacoesService.marcarComoLida(id);
      setNotificacoes(items => items.map(item => item.id === id ? { ...item, lida: true } : item));
    } catch (error) {
      toast.error(error.message || 'Não foi possível marcar a notificação como lida.');
    }
  };

  const updateFilters = useCallback((changes) => {
    setFilters(current => ({ ...current, ...changes }));
  }, []);

  const selectOccurrence = useCallback((id) => {
    setSelectedId(id);
    setOccurrence(null);
    setPage('detalhe-ocorrencia');
  }, []);

  const downloadEvidence = async (evidence) => {
    const file = await evidenciasService.descarregar(evidence.id);
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = evidence.nome_ficheiro;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const validationSaved = async () => {
    await Promise.all([
      refreshDetail(),
      loadList(page === 'dashboard'
        ? { page: 1, per_page: 5, ordenar_por: 'created_at', ordem: 'desc' }
        : filters),
    ]);
  };

  const occurrenceCreated = async (newOccurrence, evidenceFailed) => {
    await loadList({ ...filters, page: 1 });
    setPage('ocorrencias');
    if (evidenceFailed) {
      toast.error(`Ocorrência #${newOccurrence.id} criada, mas a evidência não foi anexada. Pode fazê-lo pelo detalhe.`);
    } else {
      toast.success(`Ocorrência #${newOccurrence.id} registada e aguarda validação.`);
    }
  };

  const logout = async () => {
    try {
      await onLogout();
    } catch (error) {
      toast.error(error.message || 'Não foi possível terminar a sessão.');
    }
  };

  return (
    <OperadorLayout user={user} page={page} setPage={setPage} onLogout={logout}>
      {page === 'identidade' ? (
        <GestaoVerificacoesIdentidade />
      ) : page === 'avisos' ? (
        <div className="space-y-4">
          <div><h1 className="text-xl font-bold text-ink dark:text-dink">Notificações e alertas públicos</h1><p className="text-sm text-muted">Notificações privadas da sua conta e alertas institucionais publicados.</p></div>
          {avisosError && <Card className="text-sm text-red-700" role="alert">{avisosError}<button className="ml-2 underline" onClick={loadAvisos}>Tentar novamente</button></Card>}
          {avisosLoading ? <Card role="status">A carregar avisos…</Card> : <>
            <Card><h2 className="mb-3 font-semibold">Notificações privadas</h2>{notificacoes.length === 0 ? <p className="text-sm text-muted">Sem notificações.</p> : notificacoes.map(item => <article key={item.id} className="flex flex-wrap justify-between gap-2 border-t py-3"><div><p className="font-medium">{item.titulo}</p><p className="text-sm text-muted">{item.mensagem}</p><p className="text-xs text-muted">{item.tipo} · {item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p></div>{!item.lida && <button className="text-sm text-brand underline" onClick={() => markNotificationRead(item.id)}>Marcar como lida</button>}</article>)}</Card>
            <Card><h2 className="mb-3 font-semibold">Alertas públicos</h2>{alertas.length === 0 ? <p className="text-sm text-muted">Sem alertas publicados.</p> : alertas.map(item => <article key={item.id} className="border-t py-3"><p className="font-medium">{item.titulo}</p><p className="text-sm text-muted">{item.tipo_perigo} · {item.severidade} · {item.area_geografica || 'Área não indicada'}</p><p className="mt-1 text-sm">{item.descricao}</p><p className="mt-1 text-sm"><strong>Recomendações:</strong> {item.recomendacoes}</p><p className="text-xs text-muted">Fonte: {item.fonte} · Válido até {item.valido_ate ? new Date(item.valido_ate).toLocaleString() : '—'}</p></article>)}</Card>
          </>}
        </div>
      ) : page === 'dashboard' ? (
        <OperadorDashboard
          user={user}
          ocorrencias={result.items}
          estatisticas={result.estatisticas}
          identidadeStats={identidadeStats}
          identidadeStatsError={identidadeStatsError}
          loading={listLoading}
          error={listError}
          onRefresh={refreshList}
          onSelect={selectOccurrence}
          setPage={setPage}
        />
      ) : page === 'ocorrencias' ? (
        <div className="space-y-3">
          {typesError && (
            <Card className="p-3 text-sm text-amber-800 dark:text-amber-200" role="alert">
              {typesError}
            </Card>
          )}
          <OperadorOcorrencias
            ocorrencias={result.items}
            pagination={result.pagination}
            filters={filters}
            types={types}
            loading={listLoading}
            error={listError}
            onRefresh={refreshList}
            onFiltersChange={updateFilters}
            onSelect={selectOccurrence}
          />
        </div>
      ) : page === 'registar' ? (
        <RegistarOcorrencia types={types} onCreated={occurrenceCreated} setPage={setPage} />
      ) : (
        <DetalheOcorrencia
          o={occurrence}
          loading={detailLoading}
          error={detailError}
          onRefresh={refreshDetail}
          onValidationSaved={validationSaved}
          onDownloadEvidence={downloadEvidence}
          setPage={setPage}
        />
      )}
    </OperadorLayout>
  );
}

export default OperadorWorkspace;
