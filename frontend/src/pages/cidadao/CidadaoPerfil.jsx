import React, { useEffect, useState } from 'react';
import Icon from '../../components/common/Icon';
import { Card, Button, Field, inputCls } from '../../components/common/CommonComponents';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export function CidadaoPerfil({ user }) {
  const { theme, toggleTheme } = useTheme();
  const { updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user.name, user.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      toast.success('Perfil actualizado.');
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível actualizar o perfil.');
      setFieldErrors(requestError.errors || {});
    } finally {
      setSaving(false);
    }
  };

  const createdAt = user.createdAt
    ? new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'long' }).format(new Date(user.createdAt))
    : 'Não disponibilizada pela API';

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-ink dark:text-dink">O Meu Perfil</h1>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center text-xl font-semibold">
            {user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-semibold text-ink dark:text-dink">{user.name}</p>
            <p className="text-sm text-muted dark:text-dmuted">{user.roleTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              <p>{error}</p>
              {Object.values(fieldErrors).map((message, index) => <p key={index}>{message}</p>)}
            </div>
          )}
          <Field label="Nome completo" htmlFor="perfil-name" error={fieldErrors.name}>
            <input id="perfil-name" value={name} onChange={event => setName(event.target.value)} className={inputCls} required />
          </Field>
          <Field label="Email" htmlFor="perfil-email" error={fieldErrors.email}>
            <input id="perfil-email" type="email" value={email} onChange={event => setEmail(event.target.value)} className={inputCls} required />
          </Field>
          <Field label="Perfil">
            <input value={user.roleTitle} readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
          </Field>
          <Field label="Conta criada em">
            <input value={createdAt} readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" icon="Save" disabled={saving}>
              {saving ? 'A guardar…' : 'Guardar alterações'}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-xs text-muted dark:text-dmuted">
          A alteração de palavra-passe e outros dados pessoais não está disponível na API.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-ink dark:text-dink mb-3 flex items-center gap-2">
          <Icon name="Palette" size={18} />Aparência
        </h3>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-lg border border-bd dark:border-dborder px-4 py-2 text-sm text-ink dark:text-dink"
        >
          <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
          Activar modo {theme === 'light' ? 'escuro' : 'claro'}
        </button>
        <p className="mt-3 text-xs text-muted dark:text-dmuted">
          Esta preferência fica guardada neste navegador e separada por conta neste dispositivo.
        </p>
      </Card>
    </div>
  );
}

export default CidadaoPerfil;
