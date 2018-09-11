import {h, Component} from 'preact';
import Socket from '../modules/socket';

export default class Users extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            users: []
        };
        this.message = false;
        this.messages = false;
    }

    /**
     * Runs when component mounts
     */
    componentDidMount() {
        Socket.on("users", (data) => this.onUpdate(data));
    }

    /**
     * Runs before component unmounts
     */
    componentWillUnmount() {
        Socket.off("users", (data) => this.onUpdate(data));
    }

    /**
     * Update the users
     *
     * @param data
     */
    onUpdate(data) {
        this.setState({
            users: data
        })
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="users">
                <div id="users-box" ref={c => this.messages = c}>
                    <hr/>
                    {(this.state.users.length < 1) && <span>No one is currently online</span>}
                    {this.state.users.map((user) =>
                        <span key={user}>{user}<br/></span>
                    )}
                </div>
            </div>
        );
    }
}
