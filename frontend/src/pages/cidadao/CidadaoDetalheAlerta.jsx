import React from 'react';
import Icon from '../../components/common/Icon';
import { Card, Button, EmptyState } from '../../components/common/CommonComponents';

export function CidadaoDetalheAlerta({ a, loading = false, error = '', setPage }) {
  if (loading) return <Card className="p-6">A carregar alerta…</Card>;
  if (error) return <Card className="p-6 text-red-700" role="alert">{error}</Card>;
  if (!a) {
    return (
      <EmptyState 
        icon="Bell" 
        title="Nenhum alerta seleccionado" 
        action={<Button onClick={() => setPage('alertas')}>Voltar</Button>} 
      />
    );
  }

  const nivelMap = {
    critica: { bg: 'bg-red-700', label: 'CRÍTICA' },
    alta: { bg: 'bg-orange-600', label: 'ALTA' },
    media: { bg: 'bg-yellow-600', label: 'MÉDIA' },
    baixa: { bg: 'bg-blue-700', label: 'BAIXA' },
    informativa: { bg: 'bg-slate-600', label: 'INFORMAÇÃO' },
  };
  const lvl = nivelMap[a.severidade] || nivelMap.informativa;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button 
        onClick={() => setPage('alertas')} 
        className="text-sm text-brand dark:text-dblue flex items-center gap-1 hover:underline font-medium"
      >
        <Icon name="ChevronLeft" size={16} /> Voltar aos alertas
      </button>

      <Card className="p-6">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${lvl.bg}`}>{lvl.label}</span>
          <span className="text-xs text-muted dark:text-dmuted">{a.tipo_perigo}</span>
          {a.estado === 'encerrado' && (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              Encerrado
            </span>
          )}
          {a.estado === 'publicado' && !a.activo && <span className="text-xs px-2 py-0.5 rounded bg-slate-200">Fora do período de validade</span>}
        </div>

        <h1 className="text-xl font-bold text-ink dark:text-dink">{a.titulo}</h1>

        <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm bg-light dark:bg-dsidebar/30 p-4 rounded-xl">
          <div>
            <p className="text-xs text-muted dark:text-dmuted">Região afectada</p>
            <p className="text-ink dark:text-dink font-medium">{a.area_geografica || [a.localizacao?.provincia, a.localizacao?.distrito].filter(Boolean).join(', ') || 'Não indicada'}</p>
          </div>
          <div>
            <p className="text-xs text-muted dark:text-dmuted">Publicado em</p>
            <p className="text-ink dark:text-dink">{a.data_publicacao ? new Date(a.data_publicacao).toLocaleString() : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted dark:text-dmuted">Período de validade</p>
            <p className="text-ink dark:text-dink">{new Date(a.valido_desde).toLocaleString()} – {new Date(a.valido_ate).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted dark:text-dmuted">Entidade responsável</p>
            <p className="text-ink dark:text-dink">{a.fonte}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-bd dark:border-dborder">
          <h3 className="font-semibold text-ink dark:text-dink mb-2">Descrição da Situação</h3>
          <p className="text-sm text-ink dark:text-dink leading-relaxed">{a.descricao}</p>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-lblue dark:bg-dblue/10 border border-blue-200 dark:border-blue-900/30">
          <h3 className="font-semibold text-ink dark:text-dink mb-2 flex items-center gap-2">
            <Icon name="Shield" size={16} className="text-brand dark:text-dblue" />
            Recomendações Oficiais de Segurança
          </h3>
          <p className="text-sm text-ink dark:text-dink leading-relaxed">{a.recomendacoes}</p>
        </div>

        <p className="mt-4 text-xs text-muted dark:text-dmuted">Fonte/autoridade emissora: {a.fonte}</p>
      </Card>
    </div>
  );
}

export default CidadaoDetalheAlerta;
