import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn'


export default function Main() {
    return (
       
        <BrowserRouter>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Main Component</div>

                        <div className="card-body">I'm a main component!</div>
                            <Routes>
                                <Route path="/" element={<SignIn/>}>
                   
                                </Route>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
                        </BrowserRouter>
           
    );
}

if (document.getElementById('main')) {
    ReactDOM.render(<Main />, document.getElementById('main'));
}
