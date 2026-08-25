import type { State } from "@spree/sdk";
import { useEffect, useState } from "react";

/**
 * Fetches states for a country ISO code, with cleanup on unmount/change.
 * Returns [states, loading].
 */
export function useCountryStates(
  countryIso: string,
  fetchStates: (countryIso: string) => Promise<State[]>,
  enabled = true,
): [State[], boolean] {
  const [states, setStates] = useState<State[]>([]);
  // useTransition ne convenait pas ici : startTransition recevait un callback
  // synchrone qui ne rendait pas la promesse, si bien que isPending retombait a
  // false immediatement. « En cours de chargement » etait donc toujours faux, et
  // le formulaire pouvait masquer le champ region pendant tout le chargement.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !countryIso) {
      setStates([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchStates(countryIso)
      .then((result) => {
        if (!cancelled) setStates(result);
      })
      .catch(() => {
        if (!cancelled) setStates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [countryIso, fetchStates, enabled]);

  return [states, loading];
}
