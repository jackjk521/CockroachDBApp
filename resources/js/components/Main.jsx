import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing'
import web3Connection from '../utils/web3Connection';
import Contract from '../utils/Contract';
import Formate from '../utils/Formate';
import SignIn from './SignIn'
import MessageQueue, { useMessageQueue } from "./MessageQueue";

export default function Main() {
    const { addMessage, removeMessage, messages } = useMessageQueue();
    const [ethState, setEthState] = useState({
        web3: null,
        account: null,
        contract: null,
        balance: null,
        loggedIn: false,
    });

    const getAccount = async () => {
        if (ethState.web3 !== null || ethState.web3 !== undefined) {
            await window.ethereum.on('accountsChanged', async (accounts) => {
                if(ethState.web3) {
                    ethState.web3.eth.getBalance(accounts[0], (err, balance) => {
                        if (!err) {
                            setEthState({...ethState, 
                                        account: accounts[0],
                                        loggedIn: false,
                                        balance: Formate(ethState.web3.utils.fromWei(balance, 'ether'))});
                        }
                    });
                }
            });
        }
    }

    useEffect(async () => {
        try {
            const web3 = await web3Connection();
            await window.ethereum.enable();
            const contract = await Contract(web3);
            const accounts = await web3.eth.getAccounts();

            web3.eth.getBalance(accounts[0], (err, balance) => {
                if (!err) {
                    setEthState({...ethState, 
                                web3 : web3,
                                account: accounts[0],
                                contract: contract,
                                loggedIn: false,
                                balance: Formate(web3.utils.fromWei(balance, 'ether'))});
                }
            });
        } catch(error) {
            addMessage(`Failed to load web3`, 'error');
            console.error(error);
        }

    }, []);

    useEffect(async () => {
        await getAccount();
    }), [ethState.account];

    return (
        <BrowserRouter>
        <div className="container">
            <MessageQueue messages={messages} removeMessage={removeMessage} />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Main Component</div>
                        <div className="card-body">I'm a main component!</div>
                        <Routes>
                            <Route path='/' 
                                element={ethState.loggedIn
                                    ? <SignIn userHash = {ethState.account} ethState = {ethState} setEthState = {setEthState} /> 
                                    : <Landing key = {ethState} ethState = {ethState} setEthState = {setEthState} /> 
                                }
                            />
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
