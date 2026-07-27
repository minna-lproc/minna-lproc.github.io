let deferredPrompt;
const installButtonId = 'minna-install-btn';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Create a simple install button if not present
  if (!document.getElementById(installButtonId)) {
    const btn = document.createElement('button');
    btn.id = installButtonId;
    btn.textContent = 'Install MinNa App';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '1rem',
      bottom: '1rem',
      zIndex: 1200,
      padding: '0.6rem 1rem',
      background: '#c32962',
      color: '#fff',
      border: 'none',
      borderRadius: '0.6rem',
      fontWeight: '800',
      boxShadow: '0 6px 18px rgba(76,20,40,0.18)'
    });
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') btn.remove(); else btn.disabled = false;
      deferredPrompt = null;
    });
    document.body.appendChild(btn);
  }
});

// iOS fallback: show hint when running in standalone or Safari
window.addEventListener('load', () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) {
    // Optionally hide install button
    const b = document.getElementById(installButtonId);
    if (b) b.remove();
  }
});
