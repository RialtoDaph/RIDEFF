'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Footer newsletter field. Double opt-in: the API only sends a confirmation
 * mail; the address is added to the list after the click in that mail.
 */
export function NewsletterForm() {
  const t = useTranslations('footer.newsletter');
  const tn = useTranslations('newsletter');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState(false);
  const [company, setCompany] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFailed(false);
    if (!EMAIL_RE.test(email)) return setError(true);
    setError(false);
    setBusy(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale, company }),
      });
      if (res.ok) setDone(true);
      else if (res.status === 400) setError(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="flex gap-[10px] items-center text-[15px] text-success-dark">
        <span aria-hidden="true">✓</span>
        <span>{t('done')}</span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-2 flex-1 min-w-[min(100%,280px)] max-w-[460px]">
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />
      <div
        className={`flex gap-[6px] p-[5px] rounded-full bg-night-2 border transition-colors focus-within:border-zinc-500 ${error ? 'border-orange-400' : 'border-line-d3'}`}
      >
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          aria-label={t('label')}
          aria-invalid={error || undefined}
          aria-describedby={error ? 'nl-error' : undefined}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-stone-50 text-[15px] px-[14px] py-2 placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-full bg-orange-500 text-white text-[14px] font-semibold px-[18px] py-[10px] whitespace-nowrap hover:bg-orange-450 transition-colors disabled:opacity-70 min-h-[40px]"
        >
          {t('submit')}
        </button>
      </div>
      {failed && (
        <span role="alert" className="text-[13px] text-orange-400 pl-[14px]">
          {tn('unavailable')}
        </span>
      )}
      {error && (
        <span id="nl-error" role="alert" className="font-mono text-[11px] tracking-[0.06em] text-orange-400 pl-[14px]">
          {t('error')}
        </span>
      )}
    </form>
  );
}
