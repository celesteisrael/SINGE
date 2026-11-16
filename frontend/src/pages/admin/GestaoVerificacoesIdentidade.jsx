import React, { useCallback, useEffect, useState } from 'react';
import { Card, Button, Field, inputCls, EmptyState, StatusBadge } from '../../components/common/CommonComponents';
import { identidadeService } from '../../services/identidadeService';

const STATE_LABELS = { PENDENTE: 'Pendente', EM_ANALISE: 'Em análise', APROVADA: 'Aprovada', REJEITADA: 'Rejeitada', CORRECAO_NECESSARIA: 'Correcção solicitada' };

export function GestaoVerificacoesIdentidade() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [rejection, setRejection] = useState({});
  const [reasonErrors, setReasonErrors] = useState({});

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [pending, past] = await Promise.all([identidadeService.pendentes(), identidadeService.historico()]);
      setItems(pending);
      setHistory(past);
    }
    catch (requestError) { setError(requestError.message || 'Não foi possível carregar pedidos de verificação.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const perform = async (id, operation) => {
    setBusyId(id); setError(''); setReasonErrors(current => ({ ...current, [id]: '' }));
    try {
      if (operation === 'review') await identidadeService.iniciarAnalise(id);
      if (operation === 'approve') await identidadeService.aprovar(id);
      if (operation === 'reject') {
        const reason = (rejection[id] || '').trim();
        if (reason.length < 5 || reason.length > 500) { setReasonErrors(current => ({ ...current, [id]: 'Indique um motivo entre 5 e 500 caracteres.' })); return; }
        await identidadeService.rejeitar(id, reason);
      }
      if (operation === 'correction') {
        const reason = (rejection[id] || '').trim();
        if (reason.length < 5 || reason.length > 500) { setReasonErrors(current => ({ ...current, [id]: 'Descreva a correcção entre 5 e 500 caracteres.' })); return; }
        await identidadeService.solicitarCorrecao(id, reason);
      }
      await refresh();
    } catch (requestError) {
      if (requestError.errors?.motivo) setReasonErrors(current => ({ ...current, [id]: requestError.errors.motivo }));
      setError(requestError.message || 'Não foi possível actualizar o pedido.');
    }
    finally { setBusyId(null); }
  };

  const openDocument = async id => {
    try {
      const file = await identidadeService.descarregarDocumento(id);
      const url = URL.createObjectURL(file);
      const anchor = document.createElement('a'); anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener'; anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (requestError) { setError(requestError.message || 'Não foi possível abrir o documento protegido.'); }
  };

  return <div className="space-y-4">
    <header><h2 className="text-xl font-bold">Verificação de identidade</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Fila de análise do Operador. Os números são mascarados e os documentos só são obtidos por uma rota autenticada.</p></header>
    {error && <Card role="alert" className="text-sm text-red-700 dark:text-red-300">{error}<button className="ml-2 underline" onClick={refresh}>Actualizar</button></Card>}
    <Card>{loading ? <p role="status" className="p-4 text-sm text-slate-500">A carregar pedidos…</p> : items.length === 0 ? <EmptyState icon="ShieldCheck" title="Sem pedidos pendentes" description="Os novos pedidos de verificação aparecerão aqui." /> : <div className="space-y-3">{items.map(item => <article key={item.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.solicitante?.nome || 'Cidadão'} · pedido #{item.id}</h3><p className="text-sm text-slate-600 dark:text-slate-400">{item.solicitante?.email}</p><p className="mt-1 text-sm">{item.documento?.tipo_documento} · {item.documento?.numero_documento_mascarado} · validade {item.documento?.data_validade || 'não indicada'}</p><p className="text-xs text-slate-500">Submetido em {item.created_at ? new Date(item.created_at).toLocaleString('pt-MZ') : '—'}</p></div><StatusBadge s={STATE_LABELS[item.estado] || item.estado} /></div>
      <div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary" disabled={!item.documento?.ficheiro_submetido || busyId === item.id} onClick={() => openDocument(item.id)}>Consultar documento protegido</Button>{item.estado === 'PENDENTE' && <Button variant="secondary" disabled={busyId === item.id} onClick={() => perform(item.id, 'review')}>Iniciar análise</Button>}{item.estado === 'EM_ANALISE' && <><Button disabled={busyId === item.id} onClick={() => perform(item.id, 'approve')}>Aprovar identidade</Button><Button variant="secondary" disabled={busyId === item.id} onClick={() => perform(item.id, 'correction')}>Solicitar correcção</Button><Button variant="danger" disabled={busyId === item.id} onClick={() => perform(item.id, 'reject')}>Rejeitar</Button></>}</div>
      <details className="mt-3"><summary className="cursor-pointer text-sm font-medium text-blue-700 dark:text-blue-300">Histórico do pedido ({item.historico?.length || 0})</summary><div className="mt-2 space-y-2">{(item.historico || []).map(entry => <p key={entry.id} className="border-l-2 border-blue-600 pl-3 text-xs text-slate-600 dark:text-slate-300">{entry.estado_anterior || 'Submissão'} → {entry.estado_novo} · {entry.responsavel || 'Sistema'} · {entry.created_at ? new Date(entry.created_at).toLocaleString('pt-MZ') : '—'}{entry.motivo ? ` · ${entry.motivo}` : ''}{entry.observacoes ? ` · ${entry.observacoes}` : ''}</p>)}</div></details>
      {item.estado === 'EM_ANALISE' && <div className="mt-3 max-w-xl"><Field label="Motivo ou correcção pedida (5 a 500 caracteres)" htmlFor={`rejection-${item.id}`} error={reasonErrors[item.id]}><textarea id={`rejection-${item.id}`} className={inputCls} rows="2" maxLength={500} value={rejection[item.id] || ''} onChange={event => setRejection(current => ({ ...current, [item.id]: event.target.value }))} /></Field></div>}
    </article>)}</div>}</Card>
    <Card><details><summary className="cursor-pointer p-4 font-semibold">Histórico de decisões ({history.length})</summary><div className="space-y-3 px-4 pb-4">{history.length === 0 ? <p className="text-sm text-slate-500">Ainda não existem decisões registadas.</p> : history.map(item => <article key={item.id} className="border-t pt-3 text-sm"><div className="flex flex-wrap justify-between gap-2"><strong>Pedido #{item.id} · {item.cidadao || 'Cidadão'}</strong><StatusBadge s={item.estado} /></div><p className="text-xs text-slate-500">{item.numero_documento_mascarado} · submetido {item.submetido_em ? new Date(item.submetido_em).toLocaleString('pt-MZ') : '—'} · decidido {item.decidido_em ? new Date(item.decidido_em).toLocaleString('pt-MZ') : '—'}</p>{item.motivo && <p className="mt-1">Motivo: {item.motivo}</p>}{(item.historico || []).map((entry, index) => <p key={index} className="mt-1 text-xs text-slate-600 dark:text-slate-300">{entry.estado_anterior || 'Submissão'} → {entry.estado_novo} · {entry.responsavel || '—'} · {entry.created_at ? new Date(entry.created_at).toLocaleString('pt-MZ') : '—'}{entry.motivo ? ` · ${entry.motivo}` : ''}</p>)}</article>)}</div></details></Card>
  </div>;
}

export default GestaoVerificacoesIdentidade;
