import {h, Component} from 'preact';

export default class Connect extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.nickname = null;
        this.server = null;
    }

    /**
     * Function to submit the form
     */
    submit() {
        this.props.submit(this.server.value, this.nickname.value);
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="connect">
                <input type="text" placeholder="Nickname" value="user01" ref={c => this.nickname = c}/><br/>
                <input type="text" placeholder="Server address" value="localhost:3001" ref={c => this.server = c}/><br/>
                <button onClick={() => this.submit()}>Connect</button>
            </div>
        );
    }
}
