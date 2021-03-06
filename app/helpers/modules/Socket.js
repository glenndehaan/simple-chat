const uuidv4 = require('uuid/v4');
const btoa = require('btoa');
const atob = require('atob');
const {removeByObjectValue} = require('../utils/Arrays');
const config = require('../../config');

class Socket {
    constructor(server) {
        this.server = server;
        this.socket = require('express-ws')(server);

        this.users = [];

        this.preflightCheck();
    }

    /**
     * Check if config is correct
     */
    preflightCheck() {
        if(typeof config.chat === "undefined") {
            global.log.fatal("[CONFIG] Missing chat params!");
            setTimeout(() => {
                process.exit(1);
            }, 0);
        }

        if(typeof config.chat.rooms === "undefined") {
            global.log.fatal("[CONFIG] Missing rooms!");
            setTimeout(() => {
                process.exit(1);
            }, 0);
        }

        let defaultFound = false;
        for(let item = 0; item < config.chat.rooms.length; item++) {
            if(config.chat.rooms[item].default) {
                if(!defaultFound) {
                    defaultFound = true;
                } else {
                    global.log.fatal("[CONFIG] We can't have more then 1 default room!");
                    setTimeout(() => {
                        process.exit(1);
                    }, 0);
                }
            }
        }

        this.init();
    }

    /**
     * Init the socket connection
     */
    init() {
        /**
         * WS main route
         */
        this.server.ws('/', (ws) => {
            /**
             * Create globals
             */
            ws.id = uuidv4();
            ws.nickname = false;

            /**
             * Main message bus
             */
            ws.on('message', (data) => {
                const dataString = this.decrypt(data);

                if (typeof dataString.instruction === "undefined" || dataString.instruction === "") {
                    global.log.error(`[SOCKET][${ws.id}] No instruction received from socket`);
                    return;
                }

                /**
                 * Hello function
                 */
                if (dataString.instruction === "hello") {
                    if(typeof dataString.data.nickname !== "undefined") {
                        //todo disconnect if nickname is in use

                        ws.nickname = dataString.data.nickname;
                        global.log.info(`[SOCKET][${ws.id}] User hello: ${JSON.stringify(dataString.data)}`);

                        this.users.push({
                            nickname: ws.nickname,
                            room: "afk"
                        });

                        /**
                         * Send server hello
                         */
                        ws.send(this.encrypt({
                            instruction: "hello",
                            data: {
                                version: config.application.version,
                                message: `${config.application.name} socket server connected!`
                            }
                        }));

                        /**
                         * Send new users to sockets
                         */
                        this.informAllSockets("users", {
                            users: this.users
                        });
                    }
                }

                /**
                 * Broadcasts message to all clients
                 */
                if (dataString.instruction === "message") {
                    global.log.info(`[SOCKET][${ws.id}] User message: ${JSON.stringify(dataString.data)}`);
                    this.informAllSockets("message", dataString.data);
                }
            });

            /**
             * Function to catch client disconnect
             */
            ws.on('close', () => {
                global.log.info(`[SOCKET][${ws.id}] Disconnected!`);
                removeByObjectValue(this.users, "nickname", ws.nickname);

                /**
                 * Send new users to sockets
                 */
                this.informAllSockets("users", {
                    users: this.users
                });
            });

            global.log.info(`[SOCKET][${ws.id}] User connected!`)
        });

        /**
         * Start listening on the right port/host for the socket server
         */
        global.log.info('[SOCKET] WS Socket started!');
    }

    /**
     * Function to send info to all sockets
     */
    informAllSockets(instruction, data) {
        this.socket.getWss().clients.forEach(client => {
            // Check if connection is still open
            if (client.readyState !== client.OPEN) return;

            client.send(this.encrypt({
                instruction,
                data
            }));
        });
    }

    /**
     * Function encrypt data before sending
     */
    encrypt(data) {
        const string = JSON.stringify(data);
        return btoa(string);
    }

    /**
     * Function decrypt data from socket
     */
    decrypt(data) {
        const string = atob(data);
        return JSON.parse(string);
    }
}

module.exports = Socket;
