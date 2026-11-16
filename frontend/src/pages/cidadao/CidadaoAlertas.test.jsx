import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CidadaoAlertas } from './CidadaoAlertas';
import { CidadaoInformacoes } from './CidadaoInformacoes';

const alert = {
  id: 1,
  titulo: 'Aviso de inundação',
  tipo_perigo: 'Inundação',
  severidade: 'alta',
  estado: 'publicado',
  activo: true,
  fonte: 'Autoridade competente',
  area_geografica: 'Sofala',
  descricao: 'Elevação do nível do rio.',
  recomendacoes: 'Evite a margem.',
};

describe('alertas públicos do Cidadão', () => {
  it('apresenta conteúdo recebido e sinaliza alertas expirados sem os classificar como activos', () => {
    const setPage = vi.fn();
    const setSelectedAlerta = vi.fn();
    render(<CidadaoAlertas alertas={[alert, { ...alert, id: 2, activo: false }]} setPage={setPage} setSelectedAlerta={setSelectedAlerta} />);
    expect(screen.getAllByText('Aviso de inundação')).toHaveLength(2);
    expect(screen.getByText('Fora do período de validade')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Ver detalhe' })[0]);
    expect(setSelectedAlerta).toHaveBeenCalledWith(alert);
    expect(setPage).toHaveBeenCalledWith('detalhe-alerta');
  });

  it('só apresenta recomendações provenientes de alertas actualmente válidos', () => {
    render(<CidadaoInformacoes alertas={[alert, { ...alert, id: 2, titulo: 'Alerta expirado', activo: false }]} />);
    expect(screen.getByText('Aviso de inundação')).toBeInTheDocument();
    expect(screen.queryByText('Alerta expirado')).not.toBeInTheDocument();
  });
});
