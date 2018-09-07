import {h, Component} from 'preact';
import Socket from '../modules/socket';

export default class Chat extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            messages: null
        };
        this.message = false;
        this.messages = false;
    }

    /**
     * Send the text message to the socket server
     */
    send() {
        if(this.message.value !== "") {
            Socket.send("message", {
                nickname: this.props.nickname,
                message: this.message.value,
                send: new Date().getTime()
            });

            this.message.value = "";
        }
    }

    /**
     * Send message on enter
     *
     * @param e
     */
    keyDown(e) {
        if(e.keyCode === 13) {
            this.send();
        }
    }

    /**
     * Function for incoming messages from socket
     *
     * @param data
     */
    onMessage(data) {
        this.messages.innerHTML += `
            <div>
                <stong>${data.nickname}</stong>:<br/>
                ${data.message}
            </div>
        `;
    }

    /**
     * Runs when component mounts
     */
    componentDidMount() {
        Socket.on("message", (data) => this.onMessage(data));
    }

    /**
     * Runs before component unmounts
     */
    componentWillUnmount() {
        Socket.off("message", (data) => this.onMessage(data));
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="chat">
                <div id="chat-box" ref={c => this.messages = c}>
                    <div className="message general">Waiting for someone to talk</div><hr/>
                </div>
                <div id="chat-controls">
                    <input type="text" placeholder="Message" onKeyDown={(e) => this.keyDown(e)} ref={c => this.message = c}/><br/>
                    <button onClick={() => this.send()}>Send</button>
                </div>
            </div>
        );
    }
}
