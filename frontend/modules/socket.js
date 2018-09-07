import Sockette from 'sockette';

export default new class Socket {
    initialize(url, nickname, connectedCallback, disconnectedCallback) {
        this.config = {
            url: `ws://${url}/`,
            nickname
        };
        this.ws = null;
        this.id = "";
        this.connectedCallback = connectedCallback;
        this.disconnectedCallback = disconnectedCallback;

        this.setup();
    }

    setup() {
        this.ws = new Sockette(this.config.url, {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: () => {
                console.log('[SOCKET] Connected!');
                this.connectedCallback();
            },
            onmessage: (e) => this.message(e.data),
            onreconnect: () => console.warn('[SOCKET] Reconnecting...'),
            onclose: () => console.warn('[SOCKET] Closed!'),
            onerror: e => console.error('[SOCKET] Error:', e),
            onmaximum: () => {
                console.warn('[SOCKET] Failed to reconnect!');
                this.ws.close();
                this.disconnectedCallback();
            }
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
