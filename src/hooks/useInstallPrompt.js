import { useCallback, useEffect, useState } from 'react';

const KEY = 'progibb-install-dismissed';
const HIDE_MS = 24 * 60 * 60 * 1000; // a dismissed bar stays hidden for 1 day only

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

const clearDismissed = () => {
  try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
};

const readDismissed = () => {
  // Opened as an installed app: forget the old "dismissed" note,
  // so the install button comes back after the app is deleted.
  if (isStandalone()) { clearDismissed(); return false; }
  // Old saved value ('1') counts as expired, so the button comes back.
  try {
    const t = Number(localStorage.getItem(KEY));
    return t > 0 && Date.now() - t < HIDE_MS;
  } catch { return false; }
};

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [dismissed, setDismissed] = useState(readDismissed);

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setDeferred(e); };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      // App was installed: clear the "dismissed" note so the button shows again after delete.
      clearDismissed();
      setDismissed(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try { localStorage.setItem(KEY, String(Date.now())); } catch { /* storage unavailable */ }
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null); // a prompt event can only be used once
    if (outcome === 'dismissed') dismiss();
  }, [deferred, dismiss]);

  return { installed, dismissed, canInstall: Boolean(deferred), install, dismiss };
}