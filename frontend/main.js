import {h, Component, render} from 'preact';
import Socket from './modules/socket';

class App extends Component {
    componentDidMount() {
        Socket.initialize();
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                Hi I am Preact
            </div>
        );
    }
}

render(<App/>, document.body);
