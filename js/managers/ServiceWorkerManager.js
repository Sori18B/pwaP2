export class ServiceWorkerManager {
    constructor() {
        this.swUrl = '/service-worker.js';
    }

    register() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register(this.swUrl)
                    .then(registration => {
                        console.log('Service Worker registrado con éxito:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Fallo al registrar el Service Worker:', error);
                    });
            });
        } else {
            console.log('Service Worker no es soportado en este navegador.');
        }
    }
}
