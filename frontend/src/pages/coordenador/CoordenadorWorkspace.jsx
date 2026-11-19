import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { coordenadorService } from '../../services/coordenadorService';
import { alertasPublicosService } from '../../services/alertasPublicosService';
import { ValidationError } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Button, StatCard } from '../../components/common/CommonComponents';
import Icon from '../../components/common/Icon';
import { CidadaoPerfil } from '../cidadao/CidadaoPerfil';
import { GestaoUtilizadores } from '../admin/GestaoUtilizadores';
import { AuthenticatedLayout } from '../../components/layout/AuthenticatedLayout';
import { adminService } from '../../services/adminService';
import { AdminDashboardReal } from '../admin/AdminDashboardReal';
import { MozambiqueMap } from '../../components/map/MapComponents';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const TABS = [
  ['dashboard', 'Painel geral'],
  ['ocorrencias', 'Ocorrências'],
  ['prioridades', 'Avaliar prioridades'],
  ['equipas', 'Equipas'],
  ['missoes', 'Missões'],
  ['alertas', 'Alertas públicos'],
  ['perfil', 'Meu perfil'],
];
const MISSION_STATES = ['atribuida', 'em_deslocacao', 'em_execucao', 'concluida', 'cancelada'];
const EMPTY_DASHBOARD = { ocorrencias: {}, equipas: {}, missoes: {}, recentes: [], actividade_recente: [] };
const EMPTY_FILTERS = { q: '', estado: '', tipo_ocorrencia_id: '', prioridade_id: '', page: 1, per_page: 20 };

function Card({ children, className = '' }) {
  return <section className={`rounded-xl border border-bd bg-white p-4 shadow-sm dark:border-dborder dark:bg-dcard ${className}`}>{children}</section>;
}

function PageTitle({ title, description, children }) {
  return <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-ink dark:text-dink">{title}</h2><p className="mt-1 text-sm text-muted dark:text-dmuted">{description}</p></div>{children}</div>;
}

function ErrorMessage({ error, retry }) {
  return error ? <Card className="text-sm text-red-700 dark:text-red-300" role="alert">{error}{retry && <button className="ml-3 underline" onClick={retry}>Tentar novamente</button>}</Card> : null;
}

function Table({ headers, children }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-light text-xs uppercase text-muted dark:bg-dsidebar/50"><tr>{headers.map(header => <th className="px-3 py-2" key={header}>{header}</th>)}</tr></thead><tbody className="divide-y divide-bd dark:divide-dborder">{children}</tbody></table></div>;
}

function Field({ label, children }) {
  return <label className="block space-y-1 text-sm"><span className="font-medium text-ink dark:text-dink">{label}</span>{children}</label>;
}

const input = 'w-full rounded-lg border border-bd bg-white px-3 py-2 text-sm text-ink dark:border-dborder dark:bg-dbg dark:text-dink';
const showDate = value => value ? new Date(value).toLocaleString() : '—';

export function CoordenadorWorkspace({ user, onLogout }) {
  const tabs = user.role === 'administrador' ? [...TABS.filter(([id]) => !['prioridades', 'perfil'].includes(id)), ['utilizadores', 'Gestão de utilizadores'], ['perfil', 'Meu perfil']] : TABS;
  const toast = useToast();
  const [tab, setTab] = useState('dashboard');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [adminDashboard, setAdminDashboard] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const [occurrences, setOccurrences] = useState({ items: [], pagination: {} });
  const [occurrenceTypes, setOccurrenceTypes] = useState([]);
  const [teamTypes, setTeamTypes] = useState([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [factors, setFactors] = useState([]);
  const [scores, setScores] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamFilters, setTeamFilters] = useState({ q: '', estado: '', tipo_equipa_id: '' });
  const teamFiltersRef = useRef(teamFilters);
  teamFiltersRef.current = teamFilters;
  const [missions, setMissions] = useState([]);
  const [missionFilters, setMissionFilters] = useState({ q: '', estado: '', equipa_id: '', ocorrencia_id: '' });
  const missionFiltersRef = useRef(missionFilters);
  missionFiltersRef.current = missionFilters;
  const [selectedMission, setSelectedMission] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [alertForm, setAlertForm] = useState(null);

  const loadDashboard = useCallback(async () => {
    if (user.role === 'administrador') setAdminDashboard(await adminService.dashboard());
    else setDashboard(await coordenadorService.dashboard());
  }, [user.role]);
  const loadOccurrences = useCallback(async (nextFilters = filtersRef.current) => {
    setOccurrences(await coordenadorService.ocorrencias(nextFilters));
  }, []);
  const loadTeams = useCallback(async (next = teamFiltersRef.current) => setTeams(await coordenadorService.teams(next)), []);
  const loadMissions = useCallback(async (next = missionFiltersRef.current) => setMissions(await coordenadorService.missions(next)), []);
  const loadAlerts = useCallback(async () => setAlertas(await alertasPublicosService.listarGestao()), []);

  const loadActiveTab = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      if (tab === 'dashboard') await loadDashboard();
      if (tab === 'ocorrencias') await loadOccurrences();
      if (tab === 'ocorrencias') setOccurrenceTypes(await coordenadorService.tiposOcorrencia());
      if (tab === 'prioridades') {
        const [result, factorList] = await Promise.all([
          coordenadorService.ocorrencias({ page: 1, per_page: 100, sem_prioridade: 1 }),
          coordenadorService.factors(),
        ]);
        setOccurrences(result);
        setFactors(factorList);
      }
      if (tab === 'equipas') await loadTeams();
      if (tab === 'equipas') setTeamTypes(await coordenadorService.tiposEquipa());
      if (tab === 'missoes') {
        await Promise.all([
          loadMissions(),
          loadTeams(),
          coordenadorService.tiposEquipa().then(setTeamTypes),
          coordenadorService.ocorrencias({ page: 1, per_page: 100 }).then(setOccurrences),
          coordenadorService.tiposOcorrencia().then(setOccurrenceTypes),
        ]);
      }
      if (tab === 'alertas') await loadAlerts();
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os dados.');
    } finally {
      setBusy(false);
    }
  }, [tab, loadDashboard, loadOccurrences, loadTeams, loadMissions, loadAlerts]);

  useEffect(() => { loadActiveTab(); }, [loadActiveTab]);

  useEffect(() => { if (tab !== 'equipas') return; const timer = setTimeout(() => loadTeams(teamFilters), 250); return () => clearTimeout(timer); }, [tab, teamFilters.q, teamFilters.estado, teamFilters.tipo_equipa_id, loadTeams]);
  useEffect(() => { if (tab !== 'missoes') return; const timer = setTimeout(() => loadMissions(missionFilters), 250); return () => clearTimeout(timer); }, [tab, missionFilters.q, missionFilters.estado, missionFilters.equipa_id, missionFilters.ocorrencia_id, loadMissions]);

  useEffect(() => {
    if (tab !== 'ocorrencias') return;
    const timer = setTimeout(() => loadOccurrences({ ...filters, page: 1 }), 250);
    return () => clearTimeout(timer);
  }, [tab, filters.q, filters.estado, filters.tipo_ocorrencia_id, filters.prioridade_id, loadOccurrences]);

  const selectOccurrence = async item => {
    setBusy(true);
    setError('');
    try {
      const details = await coordenadorService.ocorrencia(item.id);
      setSelectedOccurrence(details);
      setAiSuggestion(null);
      setEvaluations(details.avaliacoes || []);
      setScores(Object.fromEntries(factors.map(factor => [factor.id, 0])));
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível consultar a ocorrência.');
    } finally {
      setBusy(false);
    }
  };

  const requestPrioritySuggestion = async () => {
    if (!selectedOccurrence) return;

    setBusy(true);
    setError('');
    setAiSuggestion(null);

    try {
      const result = await coordenadorService.suggestPriority(selectedOccurrence.id);

      setAiSuggestion(result);

      if (!result.disponivel) {
        setError(result.aviso || 'Não foi possível obter sugestões da IA.');
        return;
      }

      setScores(previous => {
        const next = { ...previous };

        result.sugestoes.forEach(suggestion => {
          if (suggestion.dados_suficientes && suggestion.pontuacao !== null) {
            next[suggestion.fator_prioridade_id] = suggestion.pontuacao;
          }
        });

        return next;
      });

      toast.success('Sugestões da IA recebidas. Revê as pontuações antes de guardar.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível solicitar sugestões à IA.');
    } finally {
      setBusy(false);
    }
  };

  const submitEvaluation = async event => {
    event.preventDefault();
    if (!selectedOccurrence) return;
    setBusy(true);
    setError('');
    try {
      const result = await coordenadorService.evaluate({
        ocorrencia_id: selectedOccurrence.id,
        factores: factors.map(factor => ({
          fator_prioridade_id: factor.id,
          pontuacao: Number(scores[factor.id] ?? 0),
        })),
      });
      toast.success(`Avaliação guardada. Prioridade atribuída: ${result.prioridade || result.prioridade_id}.`);
      setSelectedOccurrence(null);
      await Promise.all([loadOccurrences(), loadDashboard()]);
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível guardar a avaliação.');
    } finally {
      setBusy(false);
    }
  };

  const openMission = async id => {
    setBusy(true);
    setError('');
    try {
      setSelectedMission(await coordenadorService.mission(id));
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível consultar a missão.');
    } finally {
      setBusy(false);
    }
  };

  const reassignMission = async equipaId => {
    if (!selectedMission || !equipaId) return;
    setBusy(true);
    setError('');
    try {
      await coordenadorService.reassignMission(selectedMission.id, Number(equipaId));
      await Promise.all([openMission(selectedMission.id), loadMissions(), loadTeams()]);
      toast.success('Equipa da missão actualizada.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível reatribuir a equipa.');
    } finally {
      setBusy(false);
    }
  };

  const actOnMission = async action => {
    if (!selectedMission) return;
    setBusy(true);
    setError('');
    try {
      if (action === 'cancelar') await coordenadorService.cancelMission(selectedMission.id);
      else if (action.startsWith('estado:')) await coordenadorService.updateMissionState(selectedMission.id, action.slice(7));
      await openMission(selectedMission.id);
      await loadMissions();
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível actualizar a missão.');
    } finally {
      setBusy(false);
    }
  };

  const submitMission = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.ocorrencia_id = Number(payload.ocorrencia_id);
    payload.equipa_id = Number(payload.equipa_id);
    setBusy(true);
    setError('');
    try {
      const created = await coordenadorService.createMission(payload);
      toast.success('Missão criada e equipa atribuída.');
      await Promise.all([openMission(created.id), loadMissions(), loadDashboard(), loadTeams()]);
    } catch (requestError) {
      setError(requestError instanceof ValidationError
        ? Object.values(requestError.errors).join(' ')
        : requestError.message || 'Não foi possível criar a missão.');
    } finally {
      setBusy(false);
    }
  };

  const saveAlert = async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.localizacao_id = payload.localizacao_id ? Number(payload.localizacao_id) : null;
    setBusy(true);
    setError('');
    try {
      const saved = alertForm.id
        ? await alertasPublicosService.actualizar(alertForm.id, payload)
        : await alertasPublicosService.criar(payload);
      setAlertForm(null);
      await loadAlerts();
      toast.success(alertForm.id ? `Alerta #${saved.id} actualizado.` : `Alerta #${saved.id} guardado como rascunho.`);
    } catch (requestError) {
      setError(requestError instanceof ValidationError
        ? Object.values(requestError.errors).join(' ')
        : requestError.message || 'Não foi possível guardar o alerta.');
    } finally {
      setBusy(false);
    }
  };

  const publishAlert = async id => {
    try {
      await alertasPublicosService.publicar(id);
      await loadAlerts();
      toast.success('Alerta publicado.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível publicar o alerta.');
    }
  };
  const closeAlert = async id => {
    try {
      await alertasPublicosService.encerrar(id);
      await loadAlerts();
      toast.success('Alerta encerrado.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível encerrar o alerta.');
    }
  };

  const totalScore = useMemo(() => factors.reduce(
    (total, factor) => total + Number(scores[factor.id] ?? 0) * Number(factor.peso),
    0,
  ), [factors, scores]);
  const priorityPreview = totalScore < 2.5 ? 'Baixa' : totalScore < 5 ? 'Média' : totalScore < 7.5 ? 'Alta' : 'Crítica';

  const renderDashboard = () => (
    user.role === 'administrador'
      ? <AdminDashboardReal data={adminDashboard} loading={busy} error={error} onRefresh={loadActiveTab} onManageUsers={() => setTab('utilizadores')} />
      : (
    <div className="space-y-4">
      <PageTitle title="Centro de Coordenação" description="Indicadores agregados e recentes calculados pelo backend." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="FileText" label="Número de ocorrências" value={dashboard.ocorrencias?.total ?? 0} tone="brand" />
        <StatCard icon="Users" label="Equipas existentes" value={dashboard.equipas?.total ?? 0} tone="green" />
        <StatCard icon="Target" label="Número de missões" value={dashboard.missoes?.total ?? 0} tone="orange" />
        <StatCard icon="AlertTriangle" label="Alertas publicados" value={dashboard.alertas_publicados ?? dashboard.alertas_activos ?? 0} tone="red" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">

        <Card><h3 className="mb-3 font-semibold">Ocorrências por prioridade</h3><div className="h-56">{(dashboard.ocorrencias?.por_prioridade || []).some(item => Number(item.total)) ? <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.ocorrencias.por_prioridade}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="nome" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#dc2626" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="text-sm text-muted">Sem avaliações de prioridade.</p>}</div></Card>
        <Card><h3 className="mb-3 font-semibold">Ocorrências por tipo</h3><div className="h-56">{(dashboard.ocorrencias?.por_tipo || []).some(item => Number(item.total)) ? <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.ocorrencias.por_tipo.filter(item => Number(item.total))}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="nome" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#0f766e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="text-sm text-muted">Sem ocorrências.</p>}</div></Card>
        <Card><h3 className="mb-3 font-semibold">Missões por estado</h3><div className="h-56">{(dashboard.missoes_por_estado || []).length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.missoes_por_estado}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="estado" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" fill="#7c3aed" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="text-sm text-muted">Ainda não existem missões.</p>}</div></Card>

        <Card><h3 className="mb-3 font-semibold">Ocorrências por localização</h3>{(dashboard.mapa_ocorrencias || []).some(item => item.latitude != null && item.longitude != null) ? <MozambiqueMap ocorrencias={dashboard.mapa_ocorrencias} height={300} onSelectOccurrence={item => { setTab('ocorrencias'); selectOccurrence({ id: item.id }); }} /> : <p className="text-sm text-muted">Não existem ocorrências com coordenadas verificadas.</p>}</Card>
      </div>
      <Card><h3 className="mb-3 font-semibold">Ocorrências recentes</h3><Table headers={['ID', 'Título', 'Tipo', 'Estado', 'Prioridade', 'Data']}><>{(dashboard.recentes || []).map(item => <tr key={item.id}><td className="px-3 py-2">{item.id}</td><td className="px-3 py-2">{item.titulo}</td><td className="px-3 py-2">{item.tipo}</td><td className="px-3 py-2">{item.estado}</td><td className="px-3 py-2">{item.prioridade || '—'}</td><td className="px-3 py-2">{showDate(item.created_at)}</td></tr>)}</></Table></Card>


    </div>
      )
  );

  const renderOccurrences = () => (
    <div className="space-y-4">
      <PageTitle title="Monitorização de ocorrências" description="Pesquisa e filtros aplicados no servidor." />
      <div className="grid gap-3 sm:grid-cols-3"><StatCard icon="FileText" label="Ocorrências registadas" value={dashboard.ocorrencias?.total ?? occurrences.pagination?.total ?? 0} tone="brand" /><StatCard icon="CheckCircle" label="Resolvidas" value={dashboard.ocorrencias?.por_estado?.resolvida ?? 0} tone="green" /><StatCard icon="XCircle" label="Canceladas" value={dashboard.ocorrencias?.por_estado?.cancelada ?? 0} tone="red" /></div>
      <Card className="grid gap-3 md:grid-cols-3">
        <input className={input} placeholder="Pesquisar por título ou localização" value={filters.q} onChange={event => setFilters({ ...filters, q: event.target.value, page: 1 })} />
        <select className={input} value={filters.estado} onChange={event => setFilters({ ...filters, estado: event.target.value, page: 1 })}><option value="">Todos os estados</option>{['registada', 'em_avaliacao', 'em_atendimento', 'resolvida', 'cancelada'].map(state => <option key={state} value={state}>{state}</option>)}</select>
        <select className={input} value={filters.tipo_ocorrencia_id} onChange={event => setFilters({ ...filters, tipo_ocorrencia_id: event.target.value, page: 1 })}><option value="">Todos os tipos</option>{occurrenceTypes.map(type => <option key={type.id} value={type.id}>{type.nome}</option>)}</select>
        <select className={input} value={filters.prioridade_id} onChange={event => setFilters({ ...filters, prioridade_id: event.target.value, page: 1 })}><option value="">Todas as prioridades</option>{(dashboard.ocorrencias?.por_prioridade || []).map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select>
      </Card>
      <Card><Table headers={['ID', 'Título', 'Tipo', 'Localização', 'Estado', 'Prioridade', '']} >{occurrences.items.map(item => <tr key={item.id}><td className="px-3 py-2">{item.id}</td><td className="px-3 py-2">{item.titulo}</td><td className="px-3 py-2">{item.tipo}</td><td className="px-3 py-2">{[item.distrito, item.provincia].filter(Boolean).join(', ') || item.localizacao}</td><td className="px-3 py-2">{item.estado}</td><td className="px-3 py-2">{item.prioridade || '—'}</td><td className="px-3 py-2"><button aria-label={`Ver ocorrência ${item.id}`} className="rounded p-1.5 text-brand hover:bg-light dark:hover:bg-dsidebar" onClick={() => selectOccurrence(item)}><Icon name="Eye" size={16} /></button></td></tr>)}</Table><div className="mt-3 flex justify-between text-sm"><span>Total: {occurrences.pagination?.total || 0}</span><div className="flex gap-2"><button disabled={(occurrences.pagination?.current_page || 1) <= 1} className="rounded border px-3 py-1 disabled:opacity-40" onClick={() => { const page = filters.page - 1; const next = { ...filters, page }; setFilters(next); loadOccurrences(next); }}>Anterior</button><button disabled={(occurrences.pagination?.current_page || 1) >= (occurrences.pagination?.last_page || 1)} className="rounded border px-3 py-1 disabled:opacity-40" onClick={() => { const page = filters.page + 1; const next = { ...filters, page }; setFilters(next); loadOccurrences(next); }}>Seguinte</button></div></div></Card>
      {selectedOccurrence && <OccurrenceDetail occurrence={selectedOccurrence} onClose={() => setSelectedOccurrence(null)} />}
    </div>
  );

  const renderPriorities = () => (
    <div className="space-y-4">
      <PageTitle title="Avaliação formal de prioridade" description="Quatro factores oficiais, pesos e classificação calculados pelo sistema." />
      <ErrorMessage error={error} />
      {selectedOccurrence ? <Card>
        <div className="mb-3 flex items-start justify-between"><div><h3 className="font-semibold">{selectedOccurrence.titulo}</h3><p className="text-sm text-muted">{selectedOccurrence.tipo} · {selectedOccurrence.localizacao}</p></div><button className="text-brand underline" onClick={() => setSelectedOccurrence(null)}>Fechar</button></div>
        <div className="mb-3 rounded-lg bg-light p-3 dark:bg-dsidebar">
          <h4 className="text-sm font-semibold">Descrição da ocorrência</h4>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink dark:text-dink">
            {selectedOccurrence.descricao || 'Sem descrição registada.'}
          </p>
        </div>
        {selectedOccurrence.validacoes?.map(validation => <p key={validation.id} className="mb-2 text-sm">Validação {validation.estado} · {validation.responsavel} · {validation.motivo || validation.observacoes || '—'}</p>)}
        <form className="space-y-3" onSubmit={submitEvaluation}>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-ink dark:text-dink">
                  Assistência de Inteligência Artificial
                </h4>
                <p className="text-xs text-muted">
                  A IA sugere pontuações. A decisão final pertence ao avaliador.
                </p>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={requestPrioritySuggestion}
                className="rounded-lg bg-brand px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                Sugerir prioridade com IA
              </button>
            </div>

            {aiSuggestion?.aviso && (
              <p className="mt-2 text-sm text-muted">{aiSuggestion.aviso}</p>
            )}

            {aiSuggestion?.fatores_sem_informacao?.length > 0 && (
              <p className="mt-2 text-sm text-orange-800 dark:text-orange-300">
                Informação insuficiente: {aiSuggestion.fatores_sem_informacao.join(', ')}.
                Estes factores precisam de avaliação humana.
              </p>
            )}
          </div>

          {factors.map(factor => {
            const suggestion = aiSuggestion?.sugestoes?.find(
              item => item.fator_prioridade_id === factor.id
            );

            return (
              <Field
                key={factor.id}
                label={`${factor.nome} (${Number(factor.peso) * 100}%)`}
              >
                <input
                  className={input}
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scores[factor.id] ?? 0}
                  onChange={event => setScores({
                    ...scores,
                    [factor.id]: event.target.value,
                  })}
                />

                <span className="text-xs text-muted">{factor.descricao}</span>

                {suggestion && (
                  <span className="block rounded bg-light p-2 text-xs dark:bg-dsidebar">
                    **Sugestão da IA:** {
                      suggestion.pontuacao === null
                        ? 'Sem pontuação — informação insuficiente.'
                        : `${suggestion.pontuacao}/10`
                    }
                    <br />
                    **Justificação:** {suggestion.justificacao}
                  </span>
                )}
              </Field>
            );
          })}

          <p className="rounded bg-light p-3 text-sm dark:bg-dsidebar">Pontuação ponderada: <strong>{totalScore.toFixed(2)}/10</strong> · Prioridade prevista: <strong>{priorityPreview}</strong></p>
          <button type="submit" disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm text-white disabled:opacity-50">Guardar avaliação</button>
        </form>
        <h4 className="mt-5 font-semibold">Avaliações anteriores</h4>
        {(selectedOccurrence.avaliacoes || []).map(item => <p className="mt-2 text-sm" key={item.id}>{item.prioridade} · {item.pontuacao_total}/10 · {item.responsavel} · {showDate(item.created_at)}</p>)}
      </Card> : <Card><Table headers={['ID', 'Título', 'Tipo', 'Estado', 'Validação', '']} >{occurrences.items.map(item => <tr key={item.id}><td className="px-3 py-2">{item.id}</td><td className="px-3 py-2">{item.titulo}</td><td className="px-3 py-2">{item.tipo}</td><td className="px-3 py-2">{item.estado}</td><td className="px-3 py-2">{item.validacao || '—'}</td><td className="px-3 py-2"><button className="text-brand underline" onClick={() => selectOccurrence(item)}>Avaliar</button></td></tr>)}</Table></Card>}
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-4">
      <PageTitle title="Equipas operacionais" description="Consulta de membros, missões e disponibilidade." />
      <Card className="grid gap-3 md:grid-cols-3">
        <input className={input} placeholder="Pesquisar equipa" value={teamFilters.q} onChange={event => setTeamFilters({ ...teamFilters, q: event.target.value })} />
        <select className={input} value={teamFilters.estado} onChange={event => setTeamFilters({ ...teamFilters, estado: event.target.value })}><option value="">Todos os estados</option>{['disponivel', 'em_missao', 'indisponivel'].map(state => <option key={state}>{state}</option>)}</select>
        <select className={input} value={teamFilters.tipo_equipa_id} onChange={event => setTeamFilters({ ...teamFilters, tipo_equipa_id: event.target.value })}><option value="">Todos os tipos</option>{teamTypes.map(type => <option key={type.id} value={type.id}>{type.nome}</option>)}</select>

      </Card>
      <div className="grid gap-3 lg:grid-cols-2">{teams.map(team => <Card key={team.id}>
        <div className="flex justify-between gap-3"><div><h3 className="font-semibold">{team.nome}</h3><p className="text-sm text-muted">{team.tipo_equipa} · {team.estado}</p></div>
          <select aria-label={`Disponibilidade ${team.nome}`} className={`${input} max-w-40`} value={team.estado} disabled={team.estado === 'em_missao'} onChange={async event => { await coordenadorService.teamAvailability(team.id, event.target.value); await loadTeams(); toast.success('Disponibilidade actualizada.'); }}><option value="disponivel">disponivel</option><option value="indisponivel">indisponivel</option></select>
        </div>
        <p className="mt-3 text-sm font-medium">Membros ({team.membros?.length || 0})</p>{(team.membros || []).map(member => <p className="text-sm text-muted" key={member.id}>{member.nome} · {member.perfil}</p>)}
        <form className="mt-3 grid grid-cols-2 gap-2" onSubmit={async event => { event.preventDefault(); const form = new FormData(event.currentTarget); const lat = form.get('latitude'); const lon = form.get('longitude'); try { await coordenadorService.updateTeamLocation(team.id, lat === '' ? null : Number(lat), lon === '' ? null : Number(lon)); await loadTeams(); toast.success('Localização da equipa actualizada.'); } catch (e) { toast.error(e.message || 'Não foi possível guardar a localização.'); } }}>
          <label className="text-xs text-muted">Latitude<input name="latitude" type="number" step="any" min="-90" max="90" defaultValue={team.latitude ?? ''} className={input} /></label>
          <label className="text-xs text-muted">Longitude<input name="longitude" type="number" step="any" min="-180" max="180" defaultValue={team.longitude ?? ''} className={input} /></label>
          <Button type="submit" size="sm" variant="secondary" className="col-span-2">Guardar localização da equipa</Button>
        </form>
        <p className="mt-3 text-sm font-medium">Missões</p>{(team.missoes || []).map(mission => <p className="text-sm text-muted" key={mission.id}>#{mission.id} · {mission.estado} · {mission.ocorrencia_titulo}</p>)}
      </Card>)}</div>
    </div>
  );

  const renderMissions = () => (
    <div className="space-y-4">
      <PageTitle title="Coordenação de missões" description={user.role === 'administrador' ? 'Consulta das missões existentes.' : 'Criação, atribuição e acompanhamento com histórico de operações.'} />
      <div className="grid gap-3 sm:grid-cols-3"><StatCard icon="Clock" label="Missões atribuídas" value={missions.filter(item => item.estado === 'atribuida').length} tone="orange" /><StatCard icon="CheckCircle" label="Concluídas" value={missions.filter(item => item.estado === 'concluida').length} tone="green" /><StatCard icon="XCircle" label="Canceladas" value={missions.filter(item => item.estado === 'cancelada').length} tone="red" /></div>
      {user.role !== 'administrador' && <Card><h3 className="mb-3 font-semibold">Criar missão</h3>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={submitMission}>
          <Field label="Ocorrência"><select required name="ocorrencia_id" className={input}><option value="">Seleccionar</option>{(occurrences.items || []).map(item => <option key={item.id} value={item.id}>#{item.id} · {item.titulo} · {item.prioridade || 'Sem prioridade'}</option>)}</select></Field>
          <Field label="Equipa disponível"><select required name="equipa_id" className={input}><option value="">Seleccionar</option>{teams.filter(team => team.estado === 'disponivel').map(team => <option key={team.id} value={team.id}>{team.nome} · {team.tipo_equipa}</option>)}</select></Field>
          <Field label="Objectivos"><textarea required name="objectivos" className={input} rows="2" /></Field>
          <Field label="Instruções operacionais"><textarea required name="instrucoes" className={input} rows="2" /></Field>
          <Field label="Data de atribuição"><input required type="datetime-local" name="data_atribuicao" className={input} /></Field>
          <Field label="Data prevista de conclusão"><input required type="datetime-local" name="data_prevista_conclusao" className={input} /></Field>
          <div className="md:col-span-2"><Button type="submit" disabled={busy}>Criar e atribuir</Button></div>
        </form>
      </Card>}
      <Card><div className="mb-3 grid gap-2 md:grid-cols-4"><input className={input} placeholder="Pesquisar missão" value={missionFilters.q} onChange={event => setMissionFilters({ ...missionFilters, q: event.target.value })} /><select className={input} value={missionFilters.estado} onChange={event => setMissionFilters({ ...missionFilters, estado: event.target.value })}><option value="">Todos os estados</option>{MISSION_STATES.map(state => <option key={state}>{state}</option>)}</select><select className={input} value={missionFilters.equipa_id} onChange={event => setMissionFilters({ ...missionFilters, equipa_id: event.target.value })}><option value="">Todas as equipas</option>{teams.map(team => <option key={team.id} value={team.id}>{team.nome}</option>)}</select><select className={input} value={missionFilters.ocorrencia_id} onChange={event => setMissionFilters({ ...missionFilters, ocorrencia_id: event.target.value })}><option value="">Todas as ocorrências</option>{occurrences.items.map(item => <option key={item.id} value={item.id}>#{item.id} · {item.titulo}</option>)}</select></div>
        <Table headers={['ID', 'Ocorrência', 'Prioridade', 'Equipa', 'Estado', 'Atribuição', '']} >{missions.map(mission => <tr key={mission.id}><td className="px-3 py-2">{mission.id}</td><td className="px-3 py-2">{mission.ocorrencia?.titulo}</td><td className="px-3 py-2">{mission.ocorrencia?.prioridade || '—'}</td><td className="px-3 py-2">{mission.equipa?.nome}</td><td className="px-3 py-2">{mission.estado}</td><td className="px-3 py-2">{showDate(mission.data_atribuicao)}</td><td className="px-3 py-2"><button aria-label={`Ver missão ${mission.id}`} className="rounded p-1.5 text-brand hover:bg-light dark:hover:bg-dsidebar" onClick={() => openMission(mission.id)}><Icon name="Eye" size={16} /></button></td></tr>)}</Table>
      </Card>
      {selectedMission && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true"><Card className="max-h-[85vh] w-full max-w-3xl overflow-y-auto p-5"><div className="flex justify-between"><h3 className="font-semibold">Missão #{selectedMission.id} · {selectedMission.estado}</h3><button className="text-brand underline" onClick={() => setSelectedMission(null)}>Fechar</button></div><p className="mt-2 text-sm">{selectedMission.objectivos}</p><p className="text-sm text-muted">{selectedMission.instrucoes}</p><p className="mt-2 text-sm">Equipa: {selectedMission.equipa?.nome} · {selectedMission.equipa?.estado}</p><p className="text-sm">Membros: {(selectedMission.equipa?.membros || []).map(member => member.nome).join(', ') || '—'}</p>{user.role !== 'administrador' && selectedMission.estado === 'atribuida' && <Field label="Reatribuir equipa"><select className={input} value="" onChange={event => reassignMission(event.target.value)}><option value="">Seleccionar equipa disponível</option>{teams.filter(team => team.estado === 'disponivel' && team.id !== selectedMission.equipa_id).map(team => <option value={team.id} key={team.id}>{team.nome}</option>)}</select></Field>}{user.role !== 'administrador' && <div className="mt-3 flex flex-wrap gap-2">{MISSION_STATES.map(state => <button key={state} className="rounded border px-2 py-1 text-xs disabled:opacity-40" disabled={busy || selectedMission.estado === state || ['concluida', 'cancelada'].includes(selectedMission.estado)} onClick={() => actOnMission(`estado:${state}`)}>{state}</button>)}<button className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 disabled:opacity-40" disabled={busy || ['concluida', 'cancelada'].includes(selectedMission.estado)} onClick={() => actOnMission('cancelar')}>Cancelar</button></div>}<h4 className="mt-4 font-semibold">Histórico</h4>{(selectedMission.historico || []).map(item => <p className="border-b py-2 text-sm" key={item.id}>{item.operacao}: {item.estado_anterior || '—'} → {item.estado_novo || '—'} · {item.utilizador} · {showDate(item.created_at)}</p>)}</Card></div>}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      <PageTitle title="Alertas públicos" description="Criar rascunhos, publicar e encerrar avisos oficiais." >
        <button className="rounded-lg bg-brand px-3 py-2 text-sm text-white" onClick={() => setAlertForm({})}>Novo alerta</button>
      </PageTitle>
      {alertForm && <Card><form className="grid gap-3 md:grid-cols-2" onSubmit={saveAlert}>
        <Field label="Título"><input required name="titulo" defaultValue={alertForm.titulo || ''} className={input} maxLength="180" /></Field>
        <Field label="Tipo de perigo"><input required name="tipo_perigo" defaultValue={alertForm.tipo_perigo || ''} className={input} /></Field>
        <Field label="Severidade"><select required name="severidade" defaultValue={alertForm.severidade || 'media'} className={input}>{['critica', 'alta', 'media', 'baixa', 'informativa'].map(value => <option key={value}>{value}</option>)}</select></Field>
        <Field label="Fonte/autoridade"><input required name="fonte" defaultValue={alertForm.fonte || ''} className={input} /></Field>
        <Field label="Área geográfica"><input name="area_geografica" defaultValue={alertForm.area_geografica || ''} className={input} /></Field>
        <Field label="ID de localização (opcional)"><input name="localizacao_id" defaultValue={alertForm.localizacao_id || ''} type="number" min="1" className={input} /></Field>
        <Field label="Válido desde"><input required name="valido_desde" type="datetime-local" defaultValue={alertForm.valido_desde?.slice(0, 16) || ''} className={input} /></Field>
        <Field label="Válido até"><input required name="valido_ate" type="datetime-local" defaultValue={alertForm.valido_ate?.slice(0, 16) || ''} className={input} /></Field>
        <Field label="Descrição"><textarea required name="descricao" defaultValue={alertForm.descricao || ''} className={input} /></Field>
        <Field label="Recomendações"><textarea required name="recomendacoes" defaultValue={alertForm.recomendacoes || ''} className={input} /></Field>
        <div className="flex gap-2 md:col-span-2"><button type="submit" disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm text-white disabled:opacity-50">{alertForm.id ? 'Actualizar alerta' : 'Guardar rascunho'}</button><button type="button" className="rounded border px-3" onClick={() => setAlertForm(null)}>Cancelar</button></div>
      </form></Card>}
      {alertas.map(alert => <Card key={alert.id}><div className="flex flex-wrap justify-between gap-2"><div><h3 className="font-semibold">{alert.titulo}</h3><p className="text-sm text-muted">{alert.severidade} · {alert.tipo_perigo} · {alert.estado} · {alert.fonte}</p><p className="mt-1 text-sm">{alert.area_geografica || 'Área geográfica não indicada'}</p></div><div className="flex gap-2">{alert.estado !== 'encerrado' && <button className="rounded border px-3 py-2 text-sm" onClick={() => setAlertForm(alert)}>Editar</button>}{alert.estado === 'rascunho' && <button className="rounded bg-brand px-3 py-2 text-sm text-white" onClick={() => publishAlert(alert.id)}>Publicar</button>}{alert.estado === 'publicado' && <button className="rounded border border-red-300 px-3 py-2 text-sm text-red-700" onClick={() => closeAlert(alert.id)}>Encerrar</button>}</div></div></Card>)}
    </div>
  );

  const navigation = tabs.map(([id, label]) => ({
    id,
    label,
    icon: ({ dashboard: 'LayoutDashboard', ocorrencias: 'FileText', prioridades: 'Activity', equipas: 'Users', missoes: 'Target', alertas: 'AlertOctagon', utilizadores: 'UserCog' })[id],
  }));

  return (
    <AuthenticatedLayout
      user={user}
      onLogout={onLogout}
      navigation={navigation}
      activePage={tab}
      onNavigate={nextTab => { setTab(nextTab); setSelectedOccurrence(null); setSelectedMission(null); }}
      title={tabs.find(([id]) => id === tab)?.[1] || 'Painel geral'}
    >
      <div className="space-y-4">
        <ErrorMessage error={error} retry={loadActiveTab} />
        {busy && <p className="text-sm text-muted" role="status">A carregar ou a guardar…</p>}
        {tab === 'dashboard' && renderDashboard()}
        {tab === 'ocorrencias' && renderOccurrences()}
        {tab === 'prioridades' && renderPriorities()}
        {tab === 'equipas' && renderTeams()}
        {tab === 'missoes' && renderMissions()}
        {tab === 'alertas' && renderAlerts()}
        {tab === 'perfil' && <CidadaoPerfil user={user} showIdentity={false} />}
        {tab === 'utilizadores' && user.role === 'administrador' && <GestaoUtilizadores />}
      </div>
    </AuthenticatedLayout>
  );
}

function OccurrenceDetail({ occurrence, onClose }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><Card className="max-h-[85vh] w-full max-w-2xl overflow-y-auto p-5" onClick={event => event.stopPropagation()}><div className="flex justify-between"><h3 className="font-semibold">Ocorrência #{occurrence.id} · {occurrence.titulo}</h3><button className="text-brand underline" onClick={onClose}>Fechar</button></div><p className="mt-2 text-sm">{occurrence.descricao}</p><p className="text-sm text-muted">{occurrence.tipo} · {occurrence.estado} · {occurrence.prioridade || 'Sem prioridade'} · Origem: {occurrence.origem}</p><h4 className="mt-4 font-semibold">Validações</h4>{(occurrence.validacoes || []).map(item => <p className="py-1 text-sm" key={item.id}>{item.estado} · {item.responsavel} · {item.motivo || item.observacoes || '—'}</p>)}<h4 className="mt-4 font-semibold">Avaliações</h4>{(occurrence.avaliacoes || []).map(item => <p className="py-1 text-sm" key={item.id}>{item.prioridade} · {item.pontuacao_total}/10 · {item.responsavel}</p>)}<h4 className="mt-4 font-semibold">Missões</h4>{(occurrence.missoes || []).map(item => <p className="py-1 text-sm" key={item.id}>#{item.id} · {item.estado} · {item.equipa}</p>)}<h4 className="mt-4 font-semibold">Histórico</h4>{(occurrence.historico || []).map(item => <p className="py-1 text-sm" key={item.id}>{item.estado_anterior || '—'} → {item.estado_novo} · {item.responsavel} · {showDate(item.created_at)}</p>)}</Card></div>;
}

export default CoordenadorWorkspace;
