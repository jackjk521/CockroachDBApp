import React, {useState, useEffect} from 'react';
import "../../css/Landing.css";
import AuthenticationHash from '../utils/AuthenticationHash';
import AuthValidation from '../utils/AuthValidation';
import MessageQueue, { useMessageQueue } from "./MessageQueue";

const Landing = ({ ethState, setEthState }) =>{
    const { addMessage, removeMessage, messages } = useMessageQueue();
    const[addClass, setAddClass] = useState("");

    const signUp = async (e) => {
        e.preventDefault()
        let userAddress = await ethState.contract.methods.getUserAddress().call({ from: ethState.account });
        
        if(userAddress !== '0x0000000000000000000000000000000000000000') {
          addMessage('This account already exists', 'error')
        } else {
          let hash = await AuthenticationHash(ethState.account, ethState.web3);
          await ethState.contract.methods.register(hash).send({ from: ethState.account });
          addMessage('Signup successful' , 'success')
          console.log(hash)
        }
    }

    const login = async (e) => {
        e.preventDefault()
        let userAddress = await ethState.contract.methods.getUserAddress().call({ from: ethState.account });

        if(userAddress === '0x0000000000000000000000000000000000000000') {
          addMessage('This account does not exist', 'error')
        } else {
          let validated = await AuthValidation(ethState.account, ethState.web3, ethState.contract)
          validated && setEthState({...ethState, loggedIn: true})
        }
    }

    return (
        <div className= "loginBody">
          <MessageQueue messages={messages} removeMessage={removeMessage} />
          <div className={`container ${addClass}`} id="container">
            <div className="form-container sign-up-container">
              
              <form className="LRForm" onSubmit = {signUp}>
                <h1 className="header1">Create Account</h1>
                <button className="loginRegbuttons" type="submit"> REGISTER </button>
              </form>
            
            </div>
            <div className="form-container sign-in-container">
              
              <form className="LRForm" onSubmit={login}>
                <h1 className="header1">Login</h1>
                <button className="loginRegbuttons" type="submit" > LOGIN </button>
              </form>
            
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <button className="loginRegbuttons ghost" id="signIn" onClick= {()=> setAddClass("")}>
                    GO TO LOGIN
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <button className="loginRegbuttons ghost" id="signUp" onClick= {()=> setAddClass("right-panel-active")}>
                      GO TO REGISTER
                  </button>
                </div>
                </div>
            </div>
          </div>
      </div>
    );
}

export default Landing;
