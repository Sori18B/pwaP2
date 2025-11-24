export class CacheManager {
    constructor() {
        this.cacheName = 'angulos-pwa-v1';
    }

    async clearCache() {
        if ('caches' in window) {
            try {
                await caches.delete(this.cacheName);
                console.log('Cache limpiada correctamente.');
                return true;
            } catch (error) {
                console.error('Error al limpiar la cache:', error);
                return false;
            }
        }
        return false;
    }
}
