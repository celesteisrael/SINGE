import React, { useCallback, useEffect, useState } from 'react';
import { Card, Button, Field, inputCls, StatusBadge } from '../../components/common/CommonComponents';
import { identidadeService } from '../../services/identidadeService';
import { ValidationError } from '../../services/api';

const STATE_LABEL = { NAO_SUBMETIDA: 'Não submetida', PENDENTE: 'Pendente', EM_ANALISE: 'Em análise', APROVADA: 'Aprovada', REJEITADA: 'Rejeitada', CORRECAO_NECESSARIA: 'Necessita de correcção' };

export function CidadaoVerificacao({ onEligibilityChange }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({ tipo_documento: 'BI', numero_documento: '', nome_documento: '', data_validade: '', ficheiro: null });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await identidadeService.minha();
      setStatus(result);
      onEligibilityChange?.(Boolean(result.elegivel));
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível consultar a verificação.');
    } finally { setLoading(false); }
  }, [onEligibilityChange]);

  useEffect(() => { refresh(); }, [refresh]);

  const submit = async event => {
    event.preventDefault();
    if (!form.ficheiro) { setError('Seleccione uma fotografia ou digitalização do documento.'); return; }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(form.ficheiro.type) || form.ficheiro.size > 10 * 1024 * 1024) {
      setError('Envie um PDF, JPG ou PNG válido até 10 MB.'); return;
    }
    if (!form.numero_documento.trim()) { setFieldErrors({ numero_documento: 'Indique o número apresentado no documento.' }); return; }
    setSaving(true); setError(''); setFieldErrors({});
    try {
      const document = await identidadeService.submeterDocumento(form);
      await identidadeService.solicitarVerificacao(document.id);
      await refresh();
      setForm(current => ({ ...current, numero_documento: '', nome_documento: '', data_validade: '', ficheiro: null }));
    } catch (requestError) {
      const message = requestError.message || 'Não foi possível submeter os documentos.';
      if (requestError instanceof ValidationError) setFieldErrors(requestError.errors);
      await refresh();
      setError(message);
    } finally { setSaving(false); }
  };

  const canResubmit = !status || ['NAO_SUBMETIDA', 'REJEITADA', 'CORRECAO_NECESSARIA'].includes(status.estado);
  const requestReview = async documentId => {
    setSaving(true); setError('');
    try { await identidadeService.solicitarVerificacao(documentId); await refresh(); }
    catch (requestError) { setError(requestError.message || 'Não foi possível pedir a análise do documento.'); }
    finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-3xl space-y-4">
    <header><h1 className="text-2xl font-bold">Verificação de identidade</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">A identidade aprovada habilita o registo de ocorrências através da sua conta. Situações urgentes podem continuar a ser registadas pelo Operador.</p></header>
    {error && <Card role="alert" className="border-red-200 bg-red-50 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{error}<button className="ml-2 underline" onClick={refresh}>Tentar novamente</button></Card>}
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Estado do pedido</h2>{status && <StatusBadge s={STATE_LABEL[status.estado] || status.estado} />}</div>
      {loading ? <p role="status" className="text-sm text-slate-500">A consultar o estado…</p> : status?.elegivel ? <p className="text-sm text-emerald-800 dark:text-emerald-300">Identidade aprovada. Já pode comunicar ocorrências com a sua conta.</p> : status?.estado === 'EM_ANALISE' || status?.estado === 'PENDENTE' ? <p className="text-sm text-slate-600 dark:text-slate-300">O pedido está em análise pelas equipas autorizadas. Poderá consultar alertas e acompanhar ocorrências entretanto.</p> : ['REJEITADA', 'CORRECAO_NECESSARIA'].includes(status?.estado) ? <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100"><strong>É necessária correcção.</strong><p>{status.motivo_rejeicao || 'Reveja a imagem e os dados do documento e submeta novamente.'}</p></div> : <p className="text-sm text-slate-600 dark:text-slate-300">Ainda não submeteu documentos de identificação.</p>}
    </Card>
    {status?.documentos?.length > 0 && <Card><h2 className="mb-2 font-semibold">Documentos submetidos</h2>{status.documentos.map(document => <div key={document.id} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 text-sm"><span>{document.tipo_documento} · {document.numero_documento_mascarado || 'Número protegido'} · {STATE_LABEL[document.estado_verificacao] || document.estado_verificacao} · ficheiro {document.ficheiro_submetido ? 'recebido' : 'em falta'}</span>{document.ficheiro_submetido && !document.verificacoes?.length && <Button variant="secondary" disabled={saving} onClick={() => requestReview(document.id)}>Pedir análise deste documento</Button>}</div>)}</Card>}
    {canResubmit && <Card><h2 className="mb-4 font-semibold">Submeter documento</h2><form className="space-y-4" onSubmit={submit}>
      <Field label="Tipo de documento" htmlFor="identity-type" required><select id="identity-type" className={inputCls} value={form.tipo_documento} onChange={event => setForm({ ...form, tipo_documento: event.target.value })}><option>BI</option><option>Passaporte</option></select></Field>
      <Field label="Número do documento" htmlFor="identity-number" required error={fieldErrors.numero_documento}><input id="identity-number" className={inputCls} required maxLength={100} value={form.numero_documento} onChange={event => setForm({ ...form, numero_documento: event.target.value })} /></Field>
      <Field label="Nome indicado no documento" htmlFor="identity-name" error={fieldErrors.nome_documento}><input id="identity-name" className={inputCls} maxLength={150} value={form.nome_documento} onChange={event => setForm({ ...form, nome_documento: event.target.value })} /></Field>
      <Field label="Data de validade (quando aplicável)" htmlFor="identity-expiry" error={fieldErrors.data_validade}><input id="identity-expiry" className={inputCls} type="date" value={form.data_validade} onChange={event => setForm({ ...form, data_validade: event.target.value })} /></Field>
      <Field label="Fotografia ou digitalização (PDF, JPG ou PNG; máximo 10 MB)" htmlFor="identity-file" required error={fieldErrors.ficheiro}><input id="identity-file" className={inputCls} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required onChange={event => setForm({ ...form, ficheiro: event.target.files?.[0] || null })} />{form.ficheiro && <span className="text-xs text-slate-500">{form.ficheiro.name} · {(form.ficheiro.size / 1024 / 1024).toFixed(2)} MB</span>}</Field>
      <Button type="submit" disabled={saving || loading}>{saving ? 'A submeter…' : 'Submeter para verificação'}</Button>
    </form></Card>}
  </div>;
}

export default CidadaoVerificacao;
