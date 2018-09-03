import {h, Component, render} from 'preact';

class App extends Component {
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
