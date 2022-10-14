import React from 'react';
import ReactDOM , { render } from 'react-dom';


export default function Main() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Main Component</div>

                        <div className="card-body">I'm a main component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

if (document.getElementById('main')) {
    ReactDOM.render(<Main />, document.getElementById('main'));
}
