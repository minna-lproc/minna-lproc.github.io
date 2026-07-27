let deferredPrompt;
const installBannerId = 'minna-install-banner';
const installButtonId = 'minna-install-btn';
const installDismissId = 'minna-install-dismiss';

function createInstallBanner() {
  if (document.getElementById(installBannerId)) return;

  const banner = document.createElement('div');
  banner.id = installBannerId;
  banner.className = 'minna-install-banner';
  banner.innerHTML = `
    <div class="minna-install-banner__content">
      <div>
        <strong>Install MinNa for a faster, offline-ready experience</strong>
        <p>Open it like an app on your desktop or phone and keep browsing even when the connection drops.</p>
      </div>
      <div class="minna-install-banner__actions">
        <button id="${installButtonId}" class="minna-install-banner__button" type="button">Install</button>
        <button id="${installDismissId}" class="minna-install-banner__dismiss" type="button" aria-label="Dismiss install prompt">×</button>
      </div>
    </div>
  `;

  const installButton = banner.querySelector(`#${installButtonId}`);
  const dismissButton = banner.querySelector(`#${installDismissId}`);

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    installButton.disabled = true;
    installButton.textContent = 'Installing…';
    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      banner.remove();
    } else {
      installButton.disabled = false;
      installButton.textContent = 'Install';
    }
    deferredPrompt = null;
  });

  dismissButton.addEventListener('click', () => {
    banner.remove();
  });

  document.body.appendChild(banner);
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  createInstallBanner();
});

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById(installBannerId);
  if (banner) banner.remove();
});

// iOS fallback: hide the banner when the site is already running as an app
window.addEventListener('load', () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const banner = document.getElementById(installBannerId);
  if (isStandalone && banner) {
    banner.remove();
  }
});
