import { useEffect, useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';

export default function InstallBar() {
  const { installed, canInstall, install } = useInstallPrompt();
  const [waited, setWaited] = useState(false);

  // Give the browser a moment to offer the native prompt before showing manual help.
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // No cross button: the bar stays until the app is installed.
  if (installed) return null;

  if (canInstall) {
    return (
      <div className="install" role="region" aria-label="Install app">
        <button type="button" className="install__btn" onClick={install}>Install app</button>
      </div>
    );
  }

  if (!waited) return null;

  return (
    <div className="install install--help" role="note">
      <p>
        To install: open your browser menu and choose <strong>Add to Home screen</strong> or <strong>Install app</strong>.
      </p>
    </div>
  );
}