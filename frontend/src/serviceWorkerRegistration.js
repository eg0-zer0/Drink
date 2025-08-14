// src/serviceWorkerRegistration.js

// Détection environnement local
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

/**
 * Enregistrement du Service Worker
 * @param {Object} config - { onUpdate(registration), onSuccess(registration) }
 */
export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Si le public_url n'est pas sur le même domaine
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        // En dev local : check si le SW existe toujours
        checkValidServiceWorker(swUrl, config);
      } else {
        // En prod : enregistrement direct
        registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * Enregistre un service worker valide et gère les mises à jour
 */
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker enregistré :', registration);

      // Si un SW en attente existe déjà (nouvelle version préchargée)
      if (registration.waiting) {
        if (config && config.onUpdate) {
          config.onUpdate(registration);
        }
      }

      // Écoute quand un nouveau SW est trouvé
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nouvelle version prête
              console.log("Nouvelle version disponible");
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Première installation
              console.log("Contenu mis en cache pour utilisation offline");
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Échec enregistrement Service Worker :', error);
    });
}

/**
 * Vérifie si le SW est valide (utile en localhost)
 */
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      // SW inexistant = on le supprime
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("Pas de connexion internet. L'application utilise la version offline.");
    });
}

/**
 * Désactive le SW
 */
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
