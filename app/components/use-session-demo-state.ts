'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export function useSessionDemoState<T>(
  storageKey: string,
  initialState: T,
  normalize: (value: unknown) => T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initialState);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restaura estado demonstrativo versionado após a hidratação
      setState(stored ? normalize(JSON.parse(stored)) : initialState);
    } catch {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // O protótipo continua em memória quando o armazenamento da sessão não está disponível.
      }
      setState(initialState);
    } finally {
      setLoadedKey(storageKey);
    }
  }, [initialState, normalize, storageKey]);

  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // O protótipo continua em memória quando a sessão não pode ser gravada.
    }
  }, [loadedKey, state, storageKey]);

  return [state, setState, loadedKey === storageKey];
}
