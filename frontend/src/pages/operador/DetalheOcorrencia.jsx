import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, Button, StatusBadge, Timeline, EmptyState, Field, inputCls } from '../../components/common/CommonComponents';
import { MozambiqueMap } from '../../components/map/MapComponents';
import { useToast } from '../../contexts/ToastContext';
import { ValidationError } from '../../services/api';
import { validacoesService } from '../../services/validacoesService';

const STATE_LABELS = {
  registada: 'Registada',
  em_avaliacao: 'Em avaliação',
  em_atendimento: 'Em atendimento',
  resolvida: 'Resolvida',
  cancelada: 'Cancelada',
};

const VALIDATION_LABELS = {
  PENDENTE: 'Pendente',
  EM_VERIFICACAO: 'Em verificação',
  VALIDADA: 'Validada',
  NAO_CONFIRMADA: 'Não confirmada',
  REJEITADA: 'Rejeitada',
  DUPLICADA: 'Duplicada',
};

const NEGATIVE_VALIDATIONS = ['NAO_CONFIRMADA', 'REJEITADA'];

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function DetalheOcorrencia({ o, loading, error, onRefresh, onValidationSaved, onDownloadEvidence, setPage }) {
  const toast = useToast();
  const [validationState, setValidationState] = useState('VALIDADA');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const submitValidation = async (event) => {
    event.preventDefault();
    if (!o || submitting) return;
    setFieldErrors({});
    setSubmitting(true);
    try {
      await validacoesService.registar({
        ocorrencia_id: o.id,
        estado: validationState,
        motivo: reason.trim(),
        observacoes: observations.trim(),
      });
      setReason('');
      setObservations('');
      await onValidationSaved?.();
      toast.success('Validação registada pelo servidor.');
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        setFieldErrors(validationError.errors);
      }
      toast.error(validationError.message || 'Não foi possível registar a validação.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadEvidence = async (evidence) => {
    setDownloadError('');
    try {
      await onDownloadEvidence(evidence);
    } catch (downloadFailure) {
      setDownloadError(downloadFailure.message || 'Não foi possível descarregar a evidência.');
    }
  };

  if (loading && !o) {
    return <Card className="p-6 text-sm text-muted dark:text-dmuted">A carregar a ocorrência…</Card>;
  }

  if (error && !o) {
    return (
      <Card className="p-6" role="alert">
        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        <button type="button" onClick={onRefresh} className="mt-2 text-sm text-brand underline">Tentar novamente</button>
      </Card>
    );
  }

  if (!o) {
    return (
      <EmptyState
        icon="FileText"
        title="Nenhuma ocorrência seleccionada"
        action={<Button onClick={() => setPage('ocorrencias')}>Voltar à lista</Button>}
      />
    );
  }

  const location = o.localizacao_geografica || {};
  const mapOccurrence = {
    lat: Number(o.latitude ?? location.latitude),
    lng: Number(o.longitude ?? location.longitude),
    prioridade: null,
  };
  const historyItems = (o.historico || []).map(item => ({
    data: formatDate(item.created_at),
    txt: [
      item.estado_novo ? `Estado: ${STATE_LABELS[item.estado_novo] || item.estado_novo}` : '',
      item.observacoes || '',
      item.utilizador_nome ? `Por ${item.utilizador_nome}` : '',
    ].filter(Boolean).join(' — ') || 'Registo de histórico',
  }));
  const latestValidation = o.validacoes?.[0];
  const requiresReason = NEGATIVE_VALIDATIONS.includes(validationState);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setPage('ocorrencias')}
        className="text-sm text-brand dark:text-dblue flex items-center gap-1 hover:underline font-medium"
      >
        <Icon name="ChevronLeft" size={16} /> Voltar às ocorrências
      </button>

      {error && (
        <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          {error}
          <button type="button" onClick={onRefresh} className="ml-2 underline">Actualizar</button>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold text-muted dark:text-dmuted">Ocorrência #{o.id}</p>
          <h1 className="text-xl font-bold text-ink dark:text-dink mt-1">{o.titulo}</h1>
          <p className="text-sm text-muted dark:text-dmuted">
            {o.tipo_ocorrencia?.nome || 'Tipo não informado'} · {formatDate(o.created_at)}
          </p>
        </div>
        <StatusBadge s={STATE_LABELS[o.estado] || o.estado} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-ink dark:text-dink">Descrição e localização</h2>
            <p className="text-sm text-ink dark:text-dink whitespace-pre-wrap">{o.descricao}</p>
            <p className="text-sm text-muted dark:text-dmuted">
              {[o.localizacao, location.endereco_referencia, location.distrito, location.provincia].filter(Boolean).join(', ') || 'Localização não disponível'}
            </p>
            <div className="border-t border-bd dark:border-dborder pt-3">
              <p className="text-xs text-muted dark:text-dmuted">Comunicante</p>
              <p className="text-sm font-medium text-ink dark:text-dink">{o.comunicante?.name || 'Dados não disponíveis'}</p>
              {o.comunicante?.email && <p className="text-sm text-muted dark:text-dmuted">{o.comunicante.email}</p>}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-ink dark:text-dink mb-3">Histórico da ocorrência</h2>
            {historyItems.length
              ? <Timeline items={historyItems} />
              : <p className="text-sm text-muted dark:text-dmuted">Não há alterações registadas no histórico.</p>}
          </Card>

          <Card className="p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-ink dark:text-dink">Validações registadas</h2>
              {latestValidation && (
                <p className="mt-2 text-sm text-ink dark:text-dink">
                  Estado mais recente: <strong>{VALIDATION_LABELS[latestValidation.estado] || latestValidation.estado}</strong>
                </p>
              )}
            </div>
            {o.validacoes?.length ? (
              <ol className="space-y-3">
                {o.validacoes.map(validation => (
                  <li key={validation.id} className="border-l-2 border-brand pl-3">
                    <p className="text-sm font-medium text-ink dark:text-dink">
                      {VALIDATION_LABELS[validation.estado] || validation.estado}
                    </p>
                    <p className="text-xs text-muted dark:text-dmuted">
                      {formatDate(validation.data_validacao || validation.created_at)}
                      {validation.utilizador_nome ? ` · ${validation.utilizador_nome}` : ''}
                    </p>
                    {validation.motivo && <p className="text-sm text-ink dark:text-dink mt-1">{validation.motivo}</p>}
                    {validation.observacoes && <p className="text-sm text-muted dark:text-dmuted mt-1">{validation.observacoes}</p>}
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm text-muted dark:text-dmuted">Ainda não existem validações.</p>}
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-ink dark:text-dink mb-3">Evidências</h2>
            {o.evidencias?.length ? (
              <ul className="divide-y divide-bd dark:divide-dborder">
                {o.evidencias.map(evidence => (
                  <li key={evidence.id} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-ink dark:text-dink truncate">{evidence.nome_ficheiro}</p>
                      <p className="text-xs text-muted dark:text-dmuted">{evidence.descricao || evidence.tipo_mime}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadEvidence(evidence)}
                      aria-label={`Descarregar ${evidence.nome_ficheiro}`}
                      className="shrink-0 p-2 text-brand dark:text-dblue"
                    >
                      <Icon name="Download" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted dark:text-dmuted">Não existem evidências anexadas.</p>}
            {downloadError && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">{downloadError}</p>}
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-ink dark:text-dink mb-1">Registar validação</h2>
            <p className="text-xs text-muted dark:text-dmuted mb-4">
              A identidade e a data são registadas pelo servidor. Esta acção não altera a prioridade nem o estado operacional.
            </p>
            <form onSubmit={submitValidation} className="space-y-4">
              <Field label="Resultado" required error={fieldErrors.estado}>
                <select
                  value={validationState}
                  onChange={event => {
                    setValidationState(event.target.value);
                    setFieldErrors(current => ({ ...current, estado: undefined, motivo: undefined }));
                  }}
                  className={inputCls}
                >
                  <option value="VALIDADA">Validada</option>
                  <option value="NAO_CONFIRMADA">Não confirmada</option>
                  <option value="REJEITADA">Rejeitada</option>
                </select>
              </Field>
              {requiresReason && (
                <Field label="Motivo" required error={fieldErrors.motivo}>
                  <textarea
                    value={reason}
                    onChange={event => setReason(event.target.value)}
                    className={inputCls}
                    rows={3}
                    required
                  />
                </Field>
              )}
              <Field label="Observações" error={fieldErrors.observacoes}>
                <textarea
                  value={observations}
                  onChange={event => setObservations(event.target.value)}
                  className={inputCls}
                  rows={3}
                />
              </Field>
              {fieldErrors.geral && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{fieldErrors.geral}</p>}
              <div className="flex justify-end">
                <Button type="submit" icon="CheckCircle" disabled={submitting}>
                  {submitting ? 'A registar…' : 'Registar validação'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-ink dark:text-dink mb-3">Localização geográfica</h2>
            <div className="h-48 rounded-lg overflow-hidden">
              <MozambiqueMap ocorrencias={[mapOccurrence]} height={192} />
            </div>
            <p className="text-xs text-muted dark:text-dmuted mt-2">
              {location.endereco_referencia || o.localizacao || 'Localização não disponível'}
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default DetalheOcorrencia;
