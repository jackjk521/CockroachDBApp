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
          await axios.post("http://localhost:3011/newUser", {user_id: hash});
          addMessage('Signup successful' , 'success')
        }
    }

    const login = async (e) => {
        e.preventDefault()
        let userAddress = await ethState.contract.methods.getUserAddress().call({ from: ethState.account });

        if(userAddress === '0x0000000000000000000000000000000000000000') {
          addMessage('This account does not exist', 'error')
        } else {
          let validated = await AuthValidation(ethState.account, ethState.web3, ethState.contract)
          if(validated.valid) {
            sessionStorage.setItem('user_id', validated.hash);
            console.log("from landing: " + validated.hash)
            setEthState({...ethState, loggedIn: true})
          }
        }
    }

    useEffect(() => {

      // Change between SignIn and SignOut forms
      const signUpButton = document.getElementById('signUp');
      const signInButton = document.getElementById('signIn');
      const container = document.getElementById('container');
      
      signUpButton.addEventListener('click', () => {
          container.classList.add("right-panel-active");
      });
      
      signInButton.addEventListener('click', () => {
          container.classList.remove("right-panel-active");
      });
  }, []);

    return (
      //new edit
            <div className="Login">
            <MessageQueue messages={messages} removeMessage={removeMessage} />
            <div className="container" id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={signUp}>
                        <h1>Create Account</h1>
                        <button className="loginRegbuttons">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={login}>
                        <h1>Login</h1>
                        <button className="loginRegbuttons">LOGIN</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost btn btn-danger" id="signIn">GO TO LOGIN</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost btn btn-danger" id="signUp"> GO TO REGISTER</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


     //   <div className= "loginBody">
      //     <MessageQueue messages={messages} removeMessage={removeMessage} />
      //     <div className={`container ${addClass}`} id="container">
      //       <div className="form-container sign-up-container">
              
      //         <form className="LRForm" onSubmit = {signUp}>
      //           <h1 className="header1">Create Account</h1>
      //           <button className="loginRegbuttons" type="submit"> REGISTER </button>
      //         </form>
            
      //       </div>
      //       <div className="form-container sign-in-container">
              
      //         <form className="LRForm" onSubmit={login}>
      //           <h1 className="header1">Login</h1>
      //           <button className="loginRegbuttons" type="submit" > LOGIN </button>
      //         </form>
            
      //       </div>
      //       <div className="overlay-container">
      //         <div className="overlay">
      //           <div className="overlay-panel overlay-left">
      //             <button className="loginRegbuttons ghost" id="signIn" onClick= {()=> setAddClass("")}>
      //               GO TO LOGIN
      //             </button>
      //           </div>
      //           <div className="overlay-panel overlay-right">
      //             <button className="loginRegbuttons ghost" id="signUp" onClick= {()=> setAddClass("right-panel-active")}>
      //                 GO TO REGISTER
      //             </button>
      //           </div>
      //           </div>
      //       </div>
      //     </div>
      // </div>

    );
}

export default Landing;
