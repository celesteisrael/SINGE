import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, EmptyState } from '../../components/common/CommonComponents';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function CidadaoNotificacoes({
  notifications = [],
  loading,
  error,
  onRefresh,
  onMarkAsRead,
}) {
  const [updating, setUpdating] = useState(null);
  const [actionError, setActionError] = useState('');

  const markAsRead = async (id) => {
    setUpdating(id);
    setActionError('');
    try {
      await onMarkAsRead(id);
    } catch (requestError) {
      setActionError(requestError.message || 'Não foi possível actualizar a notificação.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink dark:text-dink">Notificações</h1>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-bd dark:border-dborder px-3 py-2 text-sm text-ink dark:text-dink disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={16} />
          Actualizar
        </button>
      </div>

      {(error || actionError) && (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          {actionError || error}
        </div>
      )}

      <Card>
        {loading ? (
          <p className="p-5 text-sm text-muted dark:text-dmuted">A carregar notificações…</p>
        ) : notifications.length === 0 ? (
          <EmptyState icon="Bell" title="Sem notificações" description="As notificações recebidas aparecerão aqui." />
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`flex gap-3 p-4 border-b border-bd dark:border-dborder last:border-0 ${
                !notification.lida ? 'bg-lblue/30 dark:bg-dblue/5' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notification.lida ? 'bg-transparent' : 'bg-red-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    {notification.tipo}
                  </span>
                  {notification.ocorrencia_id && (
                    <span className="text-xs text-muted dark:text-dmuted">
                      Ocorrência #{notification.ocorrencia_id}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-ink dark:text-dink">{notification.titulo}</p>
                <p className="text-xs text-muted dark:text-dmuted mt-0.5">{notification.mensagem}</p>
                <p className="text-xs text-muted dark:text-dmuted mt-1">{formatDate(notification.created_at)}</p>
              </div>
              {!notification.lida && (
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  disabled={updating === notification.id}
                  className="self-center text-xs font-medium text-brand hover:underline disabled:opacity-50"
                >
                  {updating === notification.id ? 'A actualizar…' : 'Marcar como lida'}
                </button>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

export default CidadaoNotificacoes;
