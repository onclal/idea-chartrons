import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProAccess } from '../context/ProAccessContext';
import { Button, Input } from './ui';

export function ProLoginScreen() {
  const { t } = useTranslation();
  const { login } = useProAccess();
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const ok = await login(code);
      if (ok) {
        setCode('');
        return;
      }
      setError(t('proSpace.login.error'));
    } catch {
      setError(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-10 safe-top safe-bottom">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-chartrons-bordeaux to-chartrons-brick text-white text-3xl shadow-card mb-4">
            🏪
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-chartrons-brass mb-2">
            IDÉA CHARTRONS
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-chartrons-bordeaux">
            {t('proSpace.login.title')}
          </h1>
          <p className="text-sm text-chartrons-warm-gray mt-2 leading-relaxed px-2">
            {t('proSpace.login.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-card border border-chartrons-beige p-5 sm:p-8 space-y-5"
        >
          <div className="relative">
            <Input
              type={showCode ? 'text' : 'password'}
              label={t('proSpace.login.password')}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              autoComplete="off"
              autoFocus
              className="pr-20"
            />
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="absolute right-3 bottom-2.5 touch-target px-2 text-xs font-semibold text-chartrons-warm-gray hover:text-chartrons-bordeaux"
            >
              {showCode ? t('proSpace.login.hide') : t('proSpace.login.show')}
            </button>
          </div>
          {error && (
            <p className="text-sm text-chartrons-brick font-medium" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="bordeaux" size="lg" className="w-full" disabled={submitting}>
            {submitting ? t('common.loading') : t('proSpace.login.submit')}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-[44px] text-sm font-medium text-chartrons-warm-gray hover:text-chartrons-bordeaux transition-colors"
          >
            ← {t('proSpace.login.back')}
          </Link>
        </div>
      </div>
    </div>
  );
}
