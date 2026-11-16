import React, { useRef, useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, Button, StatusBadge, Timeline, EmptyState } from '../../components/common/CommonComponents';
import { MozambiqueMap } from '../../components/map/MapComponents';
import { evidenciasService } from '../../services/evidenciasService';

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
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function CidadaoDetalheOcorrencia({
  occurrence,
  loading,
  error,
  onRefresh,
  onEvidenceUploaded,
  onDownloadEvidence,
  setPage,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const fileInput = useRef(null);

  const uploadEvidence = async (event) => {
    event.preventDefault();
    if (!file || !occurrence) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    try {
      await evidenciasService.anexar(occurrence.id, file);
      setFile(null);
      if (fileInput.current) fileInput.current.value = '';
      await onEvidenceUploaded();
      setUploadSuccess('Evidência anexada com sucesso.');
    } catch (uploadFailure) {
      setUploadError(uploadFailure.message || 'Não foi possível anexar a evidência.');
    } finally {
      setUploading(false);
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

  if (loading && !occurrence) {
    return <Card className="p-6 text-sm text-muted dark:text-dmuted">A carregar a ocorrência…</Card>;
  }

  if (error && !occurrence) {
    return (
      <Card className="p-6" role="alert">
        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        <button onClick={onRefresh} className="mt-2 text-sm text-brand underline">Tentar novamente</button>
      </Card>
    );
  }

  if (!occurrence) {
    return (
      <EmptyState
        icon="FileText"
        title="Nenhuma ocorrência encontrada"
        action={<Button onClick={() => setPage('minhas-ocorrencias')}>Voltar</Button>}
      />
    );
  }

  const location = occurrence.localizacao_geografica || {};
  const history = (occurrence.historico || []).map(item => ({
    data: formatDate(item.created_at),
    txt: [
      item.estado_novo ? `Estado: ${STATE_LABELS[item.estado_novo] || item.estado_novo}` : '',
      item.observacoes || '',
    ].filter(Boolean).join(' — ') || 'Actualização registada',
  }));
  const mapOccurrence = {
    lat: Number(occurrence.latitude ?? location.latitude),
    lng: Number(occurrence.longitude ?? location.longitude),
    prioridade: occurrence.prioridade?.nome,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <button
        onClick={() => setPage('minhas-ocorrencias')}
        className="text-sm text-brand dark:text-dblue flex items-center gap-1 hover:underline font-medium"
      >
        <Icon name="ChevronLeft" size={16} /> Voltar às minhas ocorrências
      </button>

      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100" role="alert">
          {error}
          <button onClick={onRefresh} className="ml-2 underline">Actualizar</button>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted dark:text-dmuted">Referência #{occurrence.id}</p>
          <h1 className="text-xl font-bold text-ink dark:text-dink">{occurrence.titulo}</h1>
          <p className="text-sm text-muted dark:text-dmuted">
            {occurrence.tipo_ocorrencia?.nome || 'Tipo não informado'}
            {location.distrito || location.provincia ? ` · ${[location.distrito, location.provincia].filter(Boolean).join(', ')}` : ''}
          </p>
        </div>
        <StatusBadge s={STATE_LABELS[occurrence.estado] || occurrence.estado} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-ink dark:text-dink">Descrição</h3>
            <p className="text-sm text-ink dark:text-dink whitespace-pre-wrap">{occurrence.descricao}</p>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-bd dark:border-dborder text-sm">
              <div>
                <p className="text-xs text-muted dark:text-dmuted">Submetida em</p>
                <p className="text-ink dark:text-dink">{formatDate(occurrence.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-muted dark:text-dmuted">Última actualização</p>
                <p className="text-ink dark:text-dink">{formatDate(occurrence.updated_at)}</p>
              </div>
              <div>
                <p className="text-xs text-muted dark:text-dmuted">Prioridade</p>
                <p className="text-ink dark:text-dink">{occurrence.prioridade?.nome || 'Pendente de triagem oficial'}</p>
              </div>
              <div>
                <p className="text-xs text-muted dark:text-dmuted">Estado</p>
                <div className="mt-1"><StatusBadge s={STATE_LABELS[occurrence.estado] || occurrence.estado} /></div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-ink dark:text-dink mb-3">Acompanhamento e evolução</h3>
            {history.length ? <Timeline items={history} /> : (
              <p className="text-sm text-muted dark:text-dmuted">Ainda não há actualizações de acompanhamento.</p>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-ink dark:text-dink">Evidências</h3>
              <p className="text-xs text-muted dark:text-dmuted mt-1">JPG, PNG ou PDF até 10 MB por ficheiro.</p>
            </div>
            {occurrence.evidencias?.length ? (
              <ul className="divide-y divide-bd dark:divide-dborder">
                {occurrence.evidencias.map(evidence => (
                  <li key={evidence.id} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-ink dark:text-dink truncate">{evidence.nome_ficheiro}</p>
                      <p className="text-xs text-muted dark:text-dmuted">{evidence.descricao || evidence.tipo_mime}</p>
                    </div>
                    <button onClick={() => downloadEvidence(evidence)} className="shrink-0 text-brand dark:text-dblue p-2" aria-label={`Descarregar ${evidence.nome_ficheiro}`}>
                      <Icon name="Download" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted dark:text-dmuted">Não existem evidências anexadas.</p>}

            {downloadError && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{downloadError}</p>}

            <form onSubmit={uploadEvidence} className="flex flex-wrap items-end gap-3 border-t border-bd dark:border-dborder pt-4">
              <label className="flex-1 min-w-[220px] text-sm text-ink dark:text-dink">
                Anexar ficheiro
                <input
                  ref={fileInput}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={event => {
                    setFile(event.target.files?.[0] || null);
                    setUploadError('');
                    setUploadSuccess('');
                  }}
                  className="mt-1 block w-full text-sm"
                  required
                />
              </label>
              <Button type="submit" icon="Upload" disabled={!file || uploading}>
                {uploading ? 'A enviar…' : 'Anexar'}
              </Button>
            </form>
            {uploadError && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>}
            {uploadSuccess && <p role="status" className="text-sm text-green-700 dark:text-green-300">{uploadSuccess}</p>}
          </Card>

          <div className="rounded-lg border border-bd dark:border-dborder p-4 text-xs text-muted dark:text-dmuted">
            A alteração do estado e a solicitação de correcção ainda não estão disponíveis para o Cidadão nesta API.
            A prioridade é atribuída pelas entidades responsáveis durante a triagem.
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-ink dark:text-dink mb-3">Localização</h3>
            <div className="h-48 rounded-lg overflow-hidden">
              <MozambiqueMap ocorrencias={[mapOccurrence]} height={192} />
            </div>
            <p className="text-xs text-muted dark:text-dmuted mt-2">
              {[occurrence.localizacao, location.bairro, location.distrito, location.provincia].filter(Boolean).join(', ') || 'Localização não disponível'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CidadaoDetalheOcorrencia;
