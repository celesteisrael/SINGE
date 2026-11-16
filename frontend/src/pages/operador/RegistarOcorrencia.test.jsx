import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegistarOcorrencia } from './RegistarOcorrencia';
import { operadorService } from '../../services/operadorService';

vi.mock('../../services/operadorService', () => ({
  operadorService: { registarOcorrencia: vi.fn() },
}));
vi.mock('../../services/evidenciasService', () => ({
  evidenciasService: { anexar: vi.fn() },
}));

describe('registo institucional pelo Operador', () => {
  beforeEach(() => vi.clearAllMocks());

  it('envia os campos aceites pela API e não escolhe o autor do registo', async () => {
    const onCreated = vi.fn();
    const setPage = vi.fn();
    operadorService.registarOcorrencia.mockResolvedValue({ id: 44, titulo: 'Cheia' });
    render(
      <RegistarOcorrencia
        types={[{ id: 5, nome: 'Inundação', ativo: true }]}
        onCreated={onCreated}
        setPage={setPage}
      />,
    );

    fireEvent.change(screen.getByLabelText('Tipo de ocorrência'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Cheia' } });
    fireEvent.change(screen.getByLabelText('Descrição detalhada'), { target: { value: 'Subida rápida do rio.' } });
    fireEvent.change(screen.getByLabelText('Localização'), { target: { value: 'Beira' } });
    fireEvent.change(screen.getByLabelText('Origem da informação'), { target: { value: 'telefone' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registar ocorrência' }));

    await waitFor(() => expect(operadorService.registarOcorrencia).toHaveBeenCalledOnce());
    expect(operadorService.registarOcorrencia).toHaveBeenCalledWith(expect.objectContaining({
      tipo_ocorrencia_id: 5,
      titulo: 'Cheia',
      localizacao: 'Beira',
      origem: 'telefone',
    }));
    expect(operadorService.registarOcorrencia.mock.calls[0][0]).not.toHaveProperty('utilizador_id');
    expect(onCreated).toHaveBeenCalledWith({ id: 44, titulo: 'Cheia' }, false);
    expect(setPage).toHaveBeenCalledWith('ocorrencias');
  });
});
