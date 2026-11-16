import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, Button, Field, inputCls } from '../../components/common/CommonComponents';
import { LocationPicker } from '../../components/map/MapComponents';
import { GeographicComboboxes } from '../../components/common/GeographicComboboxes';
import { useToast } from '../../contexts/ToastContext';
import { validarOcorrencia } from '../../validation/ocorrencia';
import { ocorrenciasService } from '../../services/ocorrenciasService';
import { NetworkError, ValidationError } from '../../services/api';

const SECTIONS = [
  { id: 'A', label: 'Tipo' },
  { id: 'B', label: 'Descrição' },
  { id: 'C', label: 'Localização' },
  { id: 'D', label: 'Evidências' },
  { id: 'E', label: 'Confirmação' },
];

const TYPE_ICONS = ['Waves', 'Wind', 'Flame', 'MapPin', 'AlertTriangle', 'Leaf', 'AlertCircle'];

const EMPTY_FORM = {
  tipo: '',
  titulo: '',
  descricao: '',
  provincia: '',
  distrito: '',
  localidade: '',
  endereco: '',
  lat: '',
  lng: '',
  confirmed: false,
  provincia_id: '',
  distrito_id: '',
  geografia: {},
};

function mapValidationErrors(errors) {
  const mapped = { ...errors };
  Object.entries(errors).forEach(([key, message]) => {
    if (key.startsWith('referencia_geografica.')) mapped[key.replace('referencia_geografica.', '')] = message;
  });
  return {
    ...mapped,
    tipo: mapped.tipo_ocorrencia_id || mapped.tipo,
    coordenadas: mapped.latitude || mapped.longitude || mapped.coordenadas,
  };
}

export function CidadaoComunicar({ user, types = [], typesError = '', setPage, onCreated }) {
  const toast = useToast();
  const [section, setSection] = useState('A');
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const setField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
    setFieldErrors(current => {
      const next = { ...current };
      delete next[field];
      if (['provincia', 'distrito', 'localidade', 'endereco', 'lat', 'lng'].includes(field)) {
        delete next.localizacao;
        delete next.coordenadas;
      }
      return next;
    });
  };

  const setCoordinates = (latitude, longitude) => {
    setForm(current => ({
      ...current,
      lat: latitude === null || latitude === undefined ? '' : String(latitude),
      lng: longitude === null || longitude === undefined ? '' : String(longitude),
    }));
    setFieldErrors(current => {
      const next = { ...current };
      delete next.localizacao;
      delete next.coordenadas;
      delete next.latitude;
      delete next.longitude;
      return next;
    });
  };

  const getDeviceLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não disponível neste dispositivo.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates(coords.latitude, coords.longitude);
        setGeoLoading(false);
        toast.success('Localização GPS obtida.');
      },
      () => {
        setGeoLoading(false);
        toast.error('Não foi possível obter a localização. Indique-a manualmente.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const errors = validarOcorrencia(form);
    if (!form.tipo) errors.tipo = 'O tipo de ocorrência é obrigatório.';
    if (!form.confirmed) errors.confirm = 'Confirme que as informações comunicadas são verdadeiras.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setSection(errors.tipo ? 'A' : errors.titulo || errors.descricao ? 'B' : errors.localizacao ? 'C' : 'E');
      toast.error('Corrija os campos assinalados antes de submeter.');
      return;
    }

    const locationParts = [form.endereco, form.localidade, form.distrito, form.provincia]
      .map(value => value.trim())
      .filter(Boolean);
    const location = locationParts.length
      ? locationParts.join(', ')
      : `Coordenadas: ${form.lat}, ${form.lng}`;

    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const occurrence = await ocorrenciasService.registar({
        tipo_ocorrencia_id: Number(form.tipo),
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        localizacao: location,
        latitude: form.lat === '' ? null : Number(form.lat),
        longitude: form.lng === '' ? null : Number(form.lng),
        referencia_geografica: form.provincia_id && form.distrito_id ? Object.fromEntries(
          Object.entries(form.geografia).filter(([key, value]) => key.endsWith('_id') && value).map(([key, value]) => [key, Number(value)])
        ) : undefined,
      });

      setSubmitted(occurrence);
      await onCreated?.(occurrence);
      toast.success('Ocorrência comunicada com sucesso.');
    } catch (error) {
      if (error instanceof ValidationError) {
        const mappedErrors = mapValidationErrors(error.errors);
        setFieldErrors(mappedErrors);
        setSection(mappedErrors.tipo ? 'A' : mappedErrors.titulo || mappedErrors.descricao ? 'B' : 'C');
        toast.error(error.message || 'Verifique os dados assinalados.');
      } else if (error instanceof NetworkError || error.isNetworkError) {
        toast.error('Sem ligação. Os seus dados foram mantidos.');
      } else {
        toast.error(error.message || 'Erro ao submeter ocorrência.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setSection('A');
  };

  const locationValue = {
    lat: form.lat === '' ? null : Number(form.lat),
    lng: form.lng === '' ? null : Number(form.lng),
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-300 mx-auto flex items-center justify-center">
            <Icon name="CheckCircle" size={32} />
          </div>
          <h2 className="text-xl font-bold text-ink dark:text-dink mt-4">Ocorrência submetida</h2>
          <p className="text-sm text-muted dark:text-dmuted mt-1">
            A comunicação foi persistida e aguarda avaliação pelas entidades responsáveis.
          </p>
          <div className="mt-6 p-4 rounded-lg bg-light dark:bg-dsidebar/40 text-left space-y-2 border border-bd dark:border-dborder">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted dark:text-dmuted">Identificador</span>
              <span className="font-mono font-semibold text-brand dark:text-dblue">#{submitted.id}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted dark:text-dmuted">Registada em</span>
              <span className="text-ink dark:text-dink">{submitted.created_at ? new Date(submitted.created_at).toLocaleString('pt-MZ') : 'Registada'}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted dark:text-dmuted">Tipo</span>
              <span className="text-ink dark:text-dink">{submitted.tipo_ocorrencia?.nome}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted dark:text-dmuted">Prioridade</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Por avaliar</span>
            </div>
          </div>
          <p className="mt-4 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-100 text-left">
            O registo não confirma a mobilização de uma equipa nem garante assistência imediata.
          </p>
          <div className="mt-6 flex gap-2 justify-center flex-wrap">
            <Button icon="Eye" onClick={() => setPage('minhas-ocorrencias')}>Acompanhar ocorrência</Button>
            <Button variant="secondary" onClick={reset}>Nova comunicação</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-dink">Comunicar uma Ocorrência</h1>
        <p className="text-sm text-muted dark:text-dmuted mt-1">
          Forneça informações claras para ajudar as entidades responsáveis a compreender a situação.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              section === item.id
                ? 'bg-brand text-white font-medium'
                : 'bg-white dark:bg-dcard border border-bd dark:border-dborder text-ink dark:text-dink'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        <Card className="p-6 space-y-5">
          {section === 'A' && (
            <Field label="Seleccione o tipo de ocorrência" required error={fieldErrors.tipo}>
              {typesError ? (
                <p role="alert" className="text-sm text-red-700 dark:text-red-300">{typesError}</p>
              ) : types.length === 0 ? (
                <p className="text-sm text-muted dark:text-dmuted">Não existem tipos activos disponíveis para registo.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {types.map((type, index) => (
                    <button
                      key={type.id}
                      type="button"
                      data-testid={`cid-tipo-${type.id}`}
                      onClick={() => setField('tipo', String(type.id))}
                      aria-pressed={form.tipo === String(type.id)}
                      className={`p-3 rounded-lg border-2 flex flex-col items-start gap-1.5 transition-all text-left ${
                        form.tipo === String(type.id)
                          ? 'border-brand bg-lblue/50 dark:bg-dblue/10 shadow-sm'
                          : 'border-bd dark:border-dborder hover:border-brand/50'
                      }`}
                    >
                      <Icon name={TYPE_ICONS[index % TYPE_ICONS.length]} size={22} className="text-brand dark:text-dblue" />
                      <span className="text-xs font-semibold text-ink dark:text-dink">{type.nome}</span>
                    </button>
                  ))}
                </div>
              )}
            </Field>
          )}

          {section === 'B' && (
            <>
              <Field
                label="Título / descrição resumida"
                required
                hint="Escreva um resumo curto (5 a 100 caracteres)."
                htmlFor="cid-titulo"
                error={fieldErrors.titulo}
                errorTestId="titulo-error"
              >
                <input
                  id="cid-titulo"
                  data-testid="cid-titulo"
                  value={form.titulo}
                  onChange={event => setField('titulo', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.titulo)}
                  className={inputCls}
                  maxLength={100}
                  required
                />
              </Field>
              <Field
                label="Descrição detalhada"
                required
                hint="Descreva o que observou (10 a 1000 caracteres)."
                htmlFor="cid-descricao"
                error={fieldErrors.descricao}
                errorTestId="descricao-error"
              >
                <textarea
                  id="cid-descricao"
                  data-testid="cid-descricao"
                  rows={5}
                  value={form.descricao}
                  onChange={event => setField('descricao', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.descricao)}
                  className={inputCls}
                  maxLength={1000}
                  required
                />
              </Field>
            </>
          )}

          {section === 'C' && (
            <>
              {fieldErrors.localizacao && (
                <div role="alert" data-testid="localizacao-error" className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-300">
                  {fieldErrors.localizacao}
                </div>
              )}
              <GeographicComboboxes required value={form.geografia} errors={fieldErrors} onChange={geografia => {
                setForm(current => ({ ...current, geografia, provincia_id: geografia.provincia_id, distrito_id: geografia.distrito_id, provincia: geografia.provincia || '', distrito: geografia.distrito || '', endereco: geografia.endereco_referencia || current.endereco }));
                setFieldErrors(current => { const next = { ...current }; Object.keys(next).filter(key => key.endsWith('_id') || key === 'localizacao').forEach(key => delete next[key]); return next; });
              }} />
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <Button type="button" variant="secondary" icon="Navigation" onClick={getDeviceLocation} disabled={geoLoading}>
                  {geoLoading ? 'A obter coordenadas…' : 'Usar a minha localização GPS'}
                </Button>
                {form.lat && form.lng && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                    <Icon name="CheckCircle" size={14} /> {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted dark:text-dmuted">
                As coordenadas só são obtidas após a sua autorização explícita. Pode marcar o local no mapa ou preencher a localização textual.
              </p>
              <Field label="Localização no mapa" hint="Clique no mapa para marcar o local exacto (opcional).">
                <div className="h-64 rounded-xl overflow-hidden mt-2">
                  <LocationPicker value={locationValue} onChange={coords => { setCoordinates(coords.lat, coords.lng); if (coords.label) setField('endereco', coords.label); }} height={256} />
                </div>
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Latitude" htmlFor="cid-lat" error={fieldErrors.latitude || fieldErrors.coordenadas}>
                  <input type="number" step="any" id="cid-lat" data-testid="cid-lat" value={form.lat} onChange={event => setField('lat', event.target.value)} className={inputCls} />
                </Field>
                <Field label="Longitude" htmlFor="cid-lng" error={fieldErrors.longitude}>
                  <input type="number" step="any" id="cid-lng" data-testid="cid-lng" value={form.lng} onChange={event => setField('lng', event.target.value)} className={inputCls} />
                </Field>
              </div>
            </>
          )}

          {section === 'D' && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-900/40 bg-lblue/40 dark:bg-dblue/10 p-4">
              <h2 className="font-semibold text-ink dark:text-dink">Evidências</h2>
              <p className="mt-2 text-sm text-muted dark:text-dmuted">
                Depois de registar a ocorrência, poderá anexar imagens JPG/PNG ou PDF (até 10 MB por ficheiro) na página de detalhes.
                Não coloque a sua segurança em risco para obter evidências.
              </p>
            </div>
          )}

          {section === 'E' && (
            <>
              <div className="p-4 rounded-lg bg-lblue dark:bg-dblue/10 space-y-2 border border-blue-200 dark:border-blue-900/30">
                <p className="text-sm font-semibold text-ink dark:text-dink">Conta utilizada para esta comunicação</p>
                <div className="flex items-center gap-2 text-sm text-ink dark:text-dink">
                  <Icon name="User" size={14} className="text-muted dark:text-dmuted" /> {user.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-ink dark:text-dink">
                  <Icon name="Mail" size={14} className="text-muted dark:text-dmuted" /> {user.email}
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="cid-confirm"
                  data-testid="cid-confirm"
                  checked={form.confirmed}
                  onChange={event => setField('confirmed', event.target.checked)}
                  aria-invalid={Boolean(fieldErrors.confirm)}
                  className="mt-1 w-4 h-4 rounded border-bd text-brand focus:ring-brand"
                />
                <span className="text-sm text-ink dark:text-dink">
                  Confirmo que as informações prestadas são verdadeiras e correspondem ao que observei.
                </span>
              </label>
              {fieldErrors.confirm && <p role="alert" data-testid="confirm-error" className="text-xs text-red-600">{fieldErrors.confirm}</p>}
              <p className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-muted dark:text-dmuted">
                A comunicação não confirma a mobilização de equipas. Em perigo imediato, contacte os serviços de emergência competentes.
              </p>
            </>
          )}
        </Card>

        <div className="mt-4 flex gap-2 justify-between">
          <Button
            type="button"
            variant="secondary"
            disabled={section === 'A' || isSubmitting}
            onClick={() => setSection(SECTIONS[Math.max(0, SECTIONS.findIndex(item => item.id === section) - 1)].id)}
          >
            Anterior
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setPage('dashboard')} disabled={isSubmitting}>Cancelar</Button>
            {section !== 'E' ? (
              <Button
                type="button"
                onClick={() => setSection(SECTIONS[Math.min(SECTIONS.length - 1, SECTIONS.findIndex(item => item.id === section) + 1)].id)}
              >
                Seguinte
              </Button>
            ) : (
              <Button type="submit" icon="CheckCircle" id="cid-submit" data-testid="cid-submit" disabled={isSubmitting || !types.length}>
                {isSubmitting ? 'A submeter…' : 'Submeter ocorrência'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CidadaoComunicar;
