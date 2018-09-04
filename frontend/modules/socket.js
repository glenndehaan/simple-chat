import Sockette from 'sockette';

export default new class Socket {
    initialize() {
        this.config = {
            url: "ws://localhost:3001/"
        };
        this.ws = null;
        this.id = "";

        this.setup();
    }

    setup() {
        this.ws = new Sockette(this.config.url, {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: () => console.log('[SOCKET] Connected!'),
            onmessage: (e) => this.message(e.data),
            onreconnect: () => console.warn('[SOCKET] Reconnecting...'),
            onclose: () => console.warn('[SOCKET] Closed!'),
            onerror: e => console.error('[SOCKET] Error:', e)
        });
    }

    message(data) {
        const decodedMessage = atob(data);
        const message = JSON.parse(decodedMessage);

        if(message.instruction === "hello") {
            console.log(`[SOCKET] Hello: ${message.data.message}`);
        }
    }

    encrypt(data) {
        const string = JSON.stringify(data);
        return btoa(string);
    }
}
