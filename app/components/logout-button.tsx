'use client';

import { SignOut, SpinnerGap } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    if (busy) return;
    setBusy(true);

    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const payload = (await response.json()) as { redirectTo?: string };
      router.replace(payload.redirectTo ?? '/');
      router.refresh();
    } catch {
      router.replace('/');
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      aria-label={busy ? 'Saindo da conta' : 'Sair da conta'}
      className={[
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-wait disabled:opacity-60',
        compact ? 'size-11 px-0' : 'px-3 text-sm',
        className,
      ].filter(Boolean).join(' ')}
    >
      {busy ? (
        <SpinnerGap aria-hidden="true" size={18} className="animate-spin motion-reduce:animate-none" />
      ) : (
        <SignOut aria-hidden="true" size={18} weight="bold" />
      )}
      {!compact && <span>{busy ? 'Saindo…' : 'Sair'}</span>}
    </button>
  );
}
