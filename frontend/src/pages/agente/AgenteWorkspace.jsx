import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Button, StatCard, StatusBadge, EmptyState, inputCls } from '../../components/common/CommonComponents';
import { agenteService } from '../../services/agenteService';
import { notificacoesService } from '../../services/notificacoesService';
import { alertasPublicosService } from '../../services/alertasPublicosService';
import { evidenciasService } from '../../services/evidenciasService';
import { useToast } from '../../contexts/ToastContext';
import { AuthenticatedLayout } from '../../components/layout/AuthenticatedLayout';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CidadaoPerfil } from '../cidadao/CidadaoPerfil';
import { MozambiqueMap } from '../../components/map/MapComponents';

const ACTIVE_STATES = ['atribuida', 'em_deslocacao', 'em_execucao'];
const dateLabel = value => value ? new Date(value).toLocaleString() : '—';
const MISSION_COLORS = ['#2563eb', '#ea580c', '#7c3aed', '#16a34a', '#dc2626'];

export function AgenteWorkspace({ user, onLogout }) {
  const toast = useToast();
  const [missions, setMissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [observation, setObservation] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState('dashboard');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!user.teamId) {
        setMissions([]);
        setError('A sua conta ainda não está associada a uma equipa operacional.');
        return;
      }
      const [teamMissions, privateNotifications, publicAlerts] = await Promise.all([
        agenteService.missoesDaEquipa(user.teamId),
        notificacoesService.listar(),
        alertasPublicosService.listar(),
      ]);
      setMissions(teamMissions);
      setNotifications(privateNotifications);
      setAlerts(publicAlerts);
      if (selected?.id) setSelected(await agenteService.missao(selected.id));
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os dados operacionais.');
    } finally {
      setLoading(false);
    }
  }, [user.teamId, selected?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const counts = useMemo(() => ({
    total: missions.length,
    pendentes: missions.filter(item => item.estado === 'atribuida').length,
    activas: missions.filter(item => ['em_deslocacao', 'em_execucao'].includes(item.estado)).length,
    concluidas: missions.filter(item => item.estado === 'concluida').length,
  }), [missions]);
  const missionStatusChart = useMemo(() => Object.entries(missions.reduce((totals, mission) => {
    totals[mission.estado] = (totals[mission.estado] || 0) + 1;
    return totals;
  }, {})).map(([name, total]) => ({ name: name.replaceAll('_', ' '), total })), [missions]);
  const completedTrend = useMemo(() => {
    const byDay = {};
    missions.forEach(mission => (mission.historico || []).forEach(entry => {
      if (entry.estado_novo !== 'concluida') return;
      const day = String(entry.created_at || '').slice(0, 10);
      if (day) byDay[day] = (byDay[day] || 0) + 1;
    }));
    return Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-14).map(([dia, total]) => ({ dia, total }));
  }, [missions]);

  const reportActivity = async operation => {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      const payload = { operacao: operation };
      if (operation !== 'conhecimento') payload.observacoes = observation.trim();
      const updated = await agenteService.registarActividade(selected.id, payload);
      setSelected(updated);
      setObservation('');
      await refresh();
      toast.success('Actualização operacional registada.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível registar a actualização.');
    } finally {
      setBusy(false);
    }
  };

  const uploadEvidence = async () => {
    if (!selected || !evidenceFile) return;
    setBusy(true);
    setError('');
    try {
      await evidenciasService.anexar(selected.ocorrencia_id, evidenceFile, 'Evidência de execução submetida pelo Agente.');
      setEvidenceFile(null);
      setSelected(await agenteService.missao(selected.id));
      toast.success('Evidência anexada à ocorrência da missão.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível anexar a evidência.');
    } finally {
      setBusy(false);
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Painel operacional', icon: 'LayoutDashboard' },
    { id: 'missoes', label: 'Missões da equipa', icon: 'Target' },
    { id: 'historico', label: 'Histórico de operações', icon: 'History' },
    { id: 'avisos', label: 'Alertas públicos e notificações', icon: 'Bell' },
    { id: 'perfil', label: 'Meu perfil', icon: 'User' },
  ];

  return (
    <AuthenticatedLayout user={user} onLogout={onLogout} navigation={navigation} activePage={page} onNavigate={setPage} title={navigation.find(item => item.id === page)?.label}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-xl font-bold text-ink dark:text-dink">Painel do Agente</h1><p className="text-sm text-muted dark:text-dmuted">Missões da sua equipa, actualizações e avisos relevantes.</p></div></div>
        {error && <Card role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</Card>}
        {['dashboard', 'missoes'].includes(page) && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
          ['Missões da equipa', counts.total], ['Pendentes', counts.pendentes], ['Activas', counts.activas], ['Concluídas', counts.concluidas],
        ].map(([label, value], index) => <StatCard key={label} icon={['Target', 'Clock', 'Activity', 'CheckCircle'][index]} label={label} value={value} tone={['brand', 'orange', 'brand', 'green'][index]} />)}</div>}
        {page === 'dashboard' && <div className="grid gap-4 lg:grid-cols-2">
          <Card><h2 className="mb-3 font-semibold text-ink dark:text-dink">Missões da equipa por estado</h2>{missionStatusChart.length === 0 ? <p className="text-sm text-muted">Sem missões atribuídas à equipa.</p> : <div className="h-60"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={missionStatusChart} dataKey="total" nameKey="name" outerRadius={82} label={({ name, value }) => `${name} (${value})`}>{missionStatusChart.map((entry, index) => <Cell key={entry.name} fill={MISSION_COLORS[index % MISSION_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>}</Card>
          <Card><h2 className="mb-3 font-semibold text-ink dark:text-dink">Conclusões registadas</h2>{completedTrend.length === 0 ? <p className="text-sm text-muted">Ainda não há conclusões no histórico acessível da equipa.</p> : <div className="h-60"><ResponsiveContainer width="100%" height="100%"><LineChart data={completedTrend}><XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="total" stroke="#16a34a" strokeWidth={3} /></LineChart></ResponsiveContainer></div>}</Card>
          <Card><h2 className="mb-3 font-semibold text-ink dark:text-dink">Localização das missões da equipa</h2>{missions.some(item => item.ocorrencia?.latitude != null && item.ocorrencia?.longitude != null) ? <MozambiqueMap ocorrencias={missions.map(item => ({ ...item.ocorrencia, id: item.ocorrencia_id, estado: item.estado }))} height={260} /> : <p className="text-sm text-muted">As missões atribuídas ainda não têm coordenadas verificadas.</p>}</Card>
          <Card>
            <h2 className="mb-3 font-semibold text-ink dark:text-dink">Missões atribuídas à equipa</h2>
            {loading ? <p role="status" className="text-sm text-muted">A carregar missões…</p> : missions.length === 0 ? <EmptyState icon="Target" title="A equipa não tem missões atribuídas." /> : <div className="space-y-2">{missions.map(mission => <button key={mission.id} onClick={async () => { setError(''); try { setSelected(await agenteService.missao(mission.id)); } catch (e) { setError(e.message); } }} className={`w-full rounded-lg border p-3 text-left hover:border-brand ${selected?.id === mission.id ? 'border-brand' : 'border-bd dark:border-dborder'}`}><div className="flex items-start justify-between gap-2"><div><p className="font-medium">Missão #{mission.id} · {mission.ocorrencia?.titulo || `Ocorrência #${mission.ocorrencia_id}`}</p><p className="mt-1 text-xs text-muted">Atribuída em {dateLabel(mission.data_atribuicao)}</p></div><StatusBadge s={mission.estado} /></div></button>)}</div>}
          </Card>

        </div>}
        {page === 'missoes' && <Card>
          <h2 className="mb-3 font-semibold">Missões da equipa</h2>
          {missions.length === 0 ? <EmptyState icon="Target" title="A equipa não tem missões atribuídas." /> : <div className="space-y-2">{missions.map(mission => <button key={mission.id} onClick={async () => { setError(''); try { setSelected(await agenteService.missao(mission.id)); } catch (e) { setError(e.message); } }} className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left hover:border-brand ${selected?.id === mission.id ? 'border-brand' : 'border-bd dark:border-dborder'}`}><span><span className="block font-medium">Missão #{mission.id} · {mission.ocorrencia?.titulo || `Ocorrência #${mission.ocorrencia_id}`}</span><span className="text-xs text-muted">Prazo: {dateLabel(mission.data_prevista_conclusao)}</span></span><StatusBadge s={mission.estado} /></button>)}</div>}
        </Card>}
        {page === 'historico' && <Card><h2 className="mb-3 font-semibold">Histórico das missões da equipa</h2>{missions.length === 0 ? <p className="text-sm text-muted">Ainda não há operações registadas.</p> : missions.map(mission => <section key={mission.id} className="border-t py-3"><h3 className="font-medium">Missão #{mission.id} · {mission.ocorrencia?.titulo || `Ocorrência #${mission.ocorrencia_id}`}</h3>{(mission.historico || []).map(entry => <p key={entry.id} className="mt-1 text-sm text-muted">{entry.operacao.replaceAll('_', ' ')} · {entry.utilizador} · {dateLabel(entry.created_at)}{entry.observacoes ? ` — ${entry.observacoes}` : ''}</p>)}</section>)}</Card>}
        {page === 'avisos' && <div className="grid gap-4 lg:grid-cols-2"><Card className="p-4"><h2 className="mb-3 font-semibold">Alertas públicos activos</h2>{alerts.filter(alert => alert.activo).length === 0 ? <p className="text-sm text-muted">Não há alertas públicos activos.</p> : alerts.filter(alert => alert.activo).map(alert => <article key={alert.id} className="border-t py-3"><p className="font-medium">{alert.titulo}</p><p className="text-xs text-muted">{alert.severidade} · {alert.area_geografica || 'Área não indicada'} · válido até {dateLabel(alert.valido_ate)}</p><p className="mt-1 text-sm">{alert.recomendacoes}</p></article>)}</Card><Card className="p-4"><h2 className="mb-3 font-semibold">Notificações</h2>{notifications.length === 0 ? <p className="text-sm text-muted">Sem notificações.</p> : notifications.map(item => <article key={item.id} className="border-t py-3"><p className="font-medium">{item.titulo}</p><p className="text-sm text-muted">{item.mensagem}</p><p className="text-xs text-muted">{item.tipo} · {dateLabel(item.created_at)}</p></article>)}</Card></div>}
        {page === 'perfil' && <CidadaoPerfil user={user} showIdentity={false} />}
        {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto"><MissionDetails mission={selected} observation={observation} setObservation={setObservation} evidenceFile={evidenceFile} setEvidenceFile={setEvidenceFile} busy={busy} onReport={reportActivity} onUploadEvidence={uploadEvidence} onClose={() => setSelected(null)} /></div></div>}
      </div>
    </AuthenticatedLayout>
  );
}

function MissionDetails({ mission, observation, setObservation, evidenceFile, setEvidenceFile, busy, onReport, onUploadEvidence, onClose }) {
  const status = mission.estado;
  const active = ACTIVE_STATES.includes(status);
  return <Card className="p-5">
    <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold">Detalhe da missão #{mission.id}</h2><p className="text-sm text-muted">{mission.ocorrencia?.titulo} · {mission.ocorrencia?.localizacao}</p><p className="text-xs text-muted">{mission.ocorrencia?.distrito}, {mission.ocorrencia?.provincia} · prazo {dateLabel(mission.data_prevista_conclusao)}</p></div><div className="flex items-center gap-2"><StatusBadge s={status} /><button className="text-sm text-brand underline" onClick={onClose}>Fechar</button></div></div>
    <div className="mt-4 grid gap-4 md:grid-cols-2"><div><h3 className="text-sm font-semibold">Objectivos</h3><p className="text-sm">{mission.objectivos || '—'}</p><h3 className="mt-3 text-sm font-semibold">Instruções</h3><p className="text-sm">{mission.instrucoes || '—'}</p><h3 className="mt-3 text-sm font-semibold">Membros da equipa</h3>{(mission.equipa?.membros || []).map(member => <p className="text-sm text-muted" key={member.id}>{member.nome} · {member.perfil}</p>)}</div>
      <div><h3 className="text-sm font-semibold">Histórico operacional</h3><div className="mt-2 max-h-52 space-y-2 overflow-y-auto">{(mission.historico || []).map(entry => <div key={entry.id} className="border-l-2 border-brand pl-3 text-sm"><p>{entry.operacao.replaceAll('_', ' ')} · {entry.utilizador}</p><p className="text-xs text-muted">{entry.estado_anterior || '—'} → {entry.estado_novo || '—'} · {dateLabel(entry.created_at)}</p>{entry.observacoes && <p>{entry.observacoes}</p>}</div>)}</div></div></div>
    <div className="mt-4 border-t border-bd pt-4 dark:border-dborder"><h3 className="text-sm font-semibold">Evidências da ocorrência</h3>{(mission.ocorrencia?.evidencias || []).map(item => <p key={item.id} className="text-sm text-muted">{item.nome_ficheiro} · {dateLabel(item.created_at)}</p>)}{!mission.ocorrencia?.evidencias?.length && <p className="text-sm text-muted">Ainda não há evidências associadas.</p>}</div>
    {active && <div className="mt-4 space-y-3 border-t border-bd pt-4 dark:border-dborder"><label className="block space-y-1 text-sm"><span>Observação operacional (obrigatória para reporte)</span><textarea className={inputCls} rows="3" value={observation} onChange={event => setObservation(event.target.value)} placeholder="Progresso, chegada ao local, dificuldade encontrada ou resultado da intervenção" /></label><div className="flex flex-wrap gap-2">{status === 'atribuida' && <Button disabled={busy} onClick={() => onReport('conhecimento')}>Confirmar recepção</Button>}{status === 'em_deslocacao' && <Button disabled={busy || !observation.trim()} onClick={() => onReport('chegada')}>Registar chegada</Button>}{['em_deslocacao', 'em_execucao'].includes(status) && <Button variant="secondary" disabled={busy || !observation.trim()} onClick={() => onReport('progresso')}>Reportar progresso</Button>}{['em_deslocacao', 'em_execucao'].includes(status) && <Button variant="secondary" disabled={busy || !observation.trim()} onClick={() => onReport('dificuldade')}>Comunicar dificuldade</Button>}{status === 'em_execucao' && <Button disabled={busy || !observation.trim()} onClick={() => onReport('concluir')}>Concluir intervenção</Button>}</div><div className="flex flex-wrap items-end gap-2"><label className="block flex-1 space-y-1 text-sm"><span>Anexar fotografia ou relatório (JPG, PNG, PDF até 10 MB)</span><input className={inputCls} type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={event => setEvidenceFile(event.target.files?.[0] || null)} /></label><Button variant="secondary" disabled={busy || !evidenceFile} onClick={onUploadEvidence}>Enviar evidência</Button></div></div>}
  </Card>;
}

export default AgenteWorkspace;
