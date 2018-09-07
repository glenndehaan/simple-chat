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
    }

    /**
     * Send the text message to the socket server
     */
    send() {
        if(this.message.value !== "") {
            Socket.send("message", {
                nickname: this.props.nickname,
                message: this.message.value
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
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="chat">
                <div id="chat-box">
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
