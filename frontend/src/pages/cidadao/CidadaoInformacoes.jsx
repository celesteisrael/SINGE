import React from 'react';
import { Card, EmptyState } from '../../components/common/CommonComponents';

export function CidadaoInformacoes({ alertas = [], loading = false, error = '', onRefresh, setPage, setSelectedAlerta }) {
  const guides = alertas.filter(alert => alert.activo && alert.recomendacoes?.trim());

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-ink dark:text-dink">Informações de segurança</h1>
        <p className="mt-1 text-sm text-muted dark:text-dmuted">
          Recomendações provenientes de alertas publicados por fontes identificadas. Este espaço não contém conteúdo editorial permanente enquanto a API não o disponibilizar.
        </p>
      </header>
      {error && <Card className="p-4 text-sm text-red-700" role="alert">{error}<button className="ml-3 underline" onClick={onRefresh}>Tentar novamente</button></Card>}
      {loading ? <Card className="p-6 text-sm text-muted">A carregar recomendações…</Card>
        : guides.length === 0 ? <Card><EmptyState icon="BookOpen" title="Não há recomendações publicadas." description="Consulte esta área novamente quando houver informação aprovada pelas autoridades." /></Card>
          : <div className="grid gap-3 md:grid-cols-2">{guides.map(alert => (
            <Card key={alert.id} className="p-5">
              <p className="text-xs font-semibold uppercase text-muted">{alert.tipo_perigo} · {alert.fonte}</p>
              <h2 className="mt-2 font-semibold text-ink dark:text-dink">{alert.titulo}</h2>
              <p className="mt-1 text-sm text-muted">{alert.area_geografica || [alert.localizacao?.provincia, alert.localizacao?.distrito].filter(Boolean).join(', ') || 'Área não indicada'}</p>
              <p className="mt-3 text-sm text-ink dark:text-dink">{alert.recomendacoes}</p>
              <button className="mt-3 text-sm font-medium text-brand hover:underline" onClick={() => { setSelectedAlerta(alert); setPage('detalhe-alerta'); }}>Consultar alerta e validade</button>
            </Card>
          ))}</div>}
    </div>
  );
}

export default CidadaoInformacoes;
