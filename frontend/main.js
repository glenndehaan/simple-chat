import {h, Component, render} from 'preact';
import Connect from './components/Connect';
import Chat from './components/Chat';
import Users from './components/Users';
import Socket from './modules/socket';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            server: null,
            nickname: null,
            informationReady: false,
            connected: false,
            connectionError: false
        };
    }

    /**
     * Function when socket connects
     */
    connected() {
        this.setState({
            connected: true
        });
    }

    /**
     * Function when socket disconnects
     */
    disconnected() {
        this.setState({
            connected: false
        });
    }

    /**
     * Function when connect form is submit
     */
    connectSubmit(server, nickname) {
        this.setState({
            server,
            nickname
        });

        Socket.initialize(server, nickname, () => this.connected(), () => this.disconnected());
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                {!this.state.connected && <Connect submit={(server, nickname) => this.connectSubmit(server, nickname)}/>}
                {this.state.connected && <Chat nickname={this.state.nickname}/>}
                {this.state.connected && <Users/>}
            </div>
        );
    }
}

render(<App/>, document.body);
