import React, { useState } from 'react';
import { Card, Button, Field, inputCls } from '../../components/common/CommonComponents';
import { ApiError, ValidationError } from '../../services/api';
import { evidenciasService } from '../../services/evidenciasService';
import { operadorService } from '../../services/operadorService';
import { GeographicComboboxes } from '../../components/common/GeographicComboboxes';
import { LocationPicker } from '../../components/map/MapComponents';

const INITIAL = {
  titulo: '',
  descricao: '',
  tipo_ocorrencia_id: '',
  localizacao: '',
  latitude: '',
  longitude: '',
  origem: 'observacao_directa',
  comunicante_nome: '',
  comunicante_contacto: '',
  data_ocorrencia: '',
};

export function RegistarOcorrencia({ types = [], onCreated, setPage }) {
  const [form, setForm] = useState(INITIAL);
  const [evidence, setEvidence] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [geografia, setGeografia] = useState({});

  const set = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
    setErrors(current => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const submit = async event => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        localizacao: [geografia.provincia, geografia.distrito, geografia.municipio || geografia.posto_administrativo, geografia.bairro, geografia.quarteirao, geografia.endereco_referencia, form.localizacao].filter(Boolean).join(', '),
        referencia_geografica: geografia.provincia_id && geografia.distrito_id ? Object.fromEntries(
          Object.entries(geografia).filter(([key, value]) => key.endsWith('_id') && value).map(([key, value]) => [key, Number(value)])
        ) : undefined,
        tipo_ocorrencia_id: Number(form.tipo_ocorrencia_id),
        latitude: form.latitude === '' ? null : Number(form.latitude),
        longitude: form.longitude === '' ? null : Number(form.longitude),
        data_ocorrencia: form.data_ocorrencia || null,
        comunicante_nome: form.comunicante_nome || null,
        comunicante_contacto: form.comunicante_contacto || null,
      };
      const occurrence = await operadorService.registarOcorrencia(payload);
      let evidenceFailed = false;
      if (evidence) {
        try {
          await evidenciasService.anexar(occurrence.id, evidence);
        } catch {
          evidenceFailed = true;
        }
      }
      await onCreated?.(occurrence, evidenceFailed);
      setPage('ocorrencias');
      setForm(INITIAL);
      setEvidence(null);
      setGeografia({});
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors(error.errors);
      } else if (error instanceof ApiError && error.status === 403) {
        setErrors({ geral: 'A sua conta não tem autorização para registar ocorrências institucionais.' });
      } else {
        setErrors({ geral: error.message || 'Não foi possível registar a ocorrência.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header>
        <h2 className="text-xl font-bold text-ink dark:text-dink">Registar ocorrência institucional</h2>
        <p className="mt-1 text-sm text-muted dark:text-dmuted">
          O responsável pelo registo será identificado pela sessão. A ocorrência ficará pendente de validação e sem prioridade atribuída.
        </p>
      </header>
      <Card className="p-5">
        <form className="space-y-4" onSubmit={submit}>
          {errors.geral && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.geral}</p>}
          <GeographicComboboxes value={geografia} errors={errors} onChange={setGeografia} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tipo de ocorrência" required error={errors.tipo_ocorrencia_id}>
              <select aria-label="Tipo de ocorrência" className={inputCls} value={form.tipo_ocorrencia_id} onChange={event => set('tipo_ocorrencia_id', event.target.value)} required>
                <option value="">Seleccionar tipo</option>
                {types.filter(type => type.ativo !== false).map(type => <option key={type.id} value={type.id}>{type.nome}</option>)}
              </select>
            </Field>
            <Field label="Origem da informação" required error={errors.origem}>
              <select aria-label="Origem da informação" className={inputCls} value={form.origem} onChange={event => set('origem', event.target.value)}>
                <option value="observacao_directa">Observação directa</option>
                <option value="telefone">Comunicação telefónica</option>
                <option value="instituicao">Outra instituição</option>
                <option value="autoridades_locais">Autoridades locais</option>
                <option value="outra">Outra fonte</option>
              </select>
            </Field>
          </div>
          <Field label="Posição no mapa" hint="Opcional: pesquise uma referência ou marque a posição exacta.">
            <LocationPicker value={{ lat: form.latitude ? Number(form.latitude) : null, lng: form.longitude ? Number(form.longitude) : null }} onChange={point => setForm(current => ({ ...current, latitude: String(point.lat), longitude: String(point.lng), ...(point.label ? { localizacao: point.label } : {}) }))} height={240} />
          </Field>
          <Field label="Título" required error={errors.titulo}>
            <input aria-label="Título" className={inputCls} value={form.titulo} onChange={event => set('titulo', event.target.value)} required maxLength={150} />
          </Field>
          <Field label="Descrição detalhada" required error={errors.descricao}>
            <textarea aria-label="Descrição detalhada" className={inputCls} rows={4} value={form.descricao} onChange={event => set('descricao', event.target.value)} required />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Localização" required error={errors.localizacao}>
              <input aria-label="Localização" className={inputCls} value={form.localizacao} onChange={event => set('localizacao', event.target.value)} required maxLength={255} placeholder="Localidade, distrito, referência" />
            </Field>
            <Field label="Data e hora do acontecimento" error={errors.data_ocorrencia}>
              <input type="datetime-local" className={inputCls} value={form.data_ocorrencia} onChange={event => set('data_ocorrencia', event.target.value)} />
            </Field>
            <Field label="Latitude" error={errors.latitude}>
              <input type="number" step="any" min="-90" max="90" className={inputCls} value={form.latitude} onChange={event => set('latitude', event.target.value)} />
            </Field>
            <Field label="Longitude" error={errors.longitude}>
              <input type="number" step="any" min="-180" max="180" className={inputCls} value={form.longitude} onChange={event => set('longitude', event.target.value)} />
            </Field>
            <Field label="Nome do comunicante (opcional)" error={errors.comunicante_nome}>
              <input className={inputCls} value={form.comunicante_nome} onChange={event => set('comunicante_nome', event.target.value)} maxLength={150} />
            </Field>
            <Field label="Contacto do comunicante (opcional)" error={errors.comunicante_contacto}>
              <input className={inputCls} value={form.comunicante_contacto} onChange={event => set('comunicante_contacto', event.target.value)} maxLength={80} />
            </Field>
          </div>
          <Field label="Evidência (opcional, JPG/PNG/PDF até 10 MB)" error={errors.ficheiro}>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={event => setEvidence(event.target.files?.[0] || null)} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setPage('ocorrencias')}>Cancelar</Button>
            <Button type="submit" disabled={submitting || types.length === 0}>
              {submitting ? 'A registar…' : 'Registar ocorrência'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RegistarOcorrencia;
