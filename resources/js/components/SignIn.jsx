import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';   
import axios from "axios";

export const userHash = 'secretHashHere'

export default function SignIn() {
   const navigate = useNavigate();

   const [devState, setDevState] = useState({
            userID: userHash, // had to set the hash here 
            topic:'',
            devState:'',
    });

    const handleInput = (e) =>{
        const {name, value} = e.target;
    
        setDevState(prevState =>({
            ...prevState,
            [name] : value
        }))
    }

//     const signedContract = async (e) => {
//         e.preventDefault();

//         try{
//             const res = await axios.post("http://localhost:3011/state", devState);
//             if(res.status == 200)
//             {
                
//                 runTrans();
//                 if(runTrans()){
//                     console.log('runtrans works')
//                 }
                
//                 setDevState({
//                             userHash:'',
//                             topic:'',
//                             dev_state:'',
//                             });

//                 console.log(devState);

//                 navigate('/');
               
//             }
//             else{
//                 console.log(res);
//             }
//           }
//           catch(err){
//               console.log(err);
//           }
//     }

    return(
        <div>
            <form className="LRForm" onSubmit = {signedContract}>

                <h1 className="header1">State Change</h1>
                <input className ="inputBox" name = 'userID' type="hidden"  onChange={handleInput} value={devState.userID|| ({userHash})}/>
                <input className ="inputBox" name = 'topic' type="text"  onChange={handleInput} value={devState.topic || ""} placeholder="Topic" />
                <input className ="inputBox" name = 'devState' type="number" onChange={handleInput} value={devState.devState || ""}   placeholder="State: 1 or 0" />
                <button className="loginRegbuttons" type="submit"> Change state </button>

              </form>

              {/* add more buttons for the creating and etc here */}
        </div>
    )
}