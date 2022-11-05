import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';   
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

import ToggleButton from 'react-toggle-button'


export const userHash = 'secretHashHere'

const SignIn = () => {
   const navigate = useNavigate();

   const [thingState, setThingState] = useState({
            user_id: userHash, 
            userName: 'Sample',
            led:'No Sensor Setup',
            sound:'No Sensor Setup',
            motion:'No Sensor Setup',
            temp: 'No Sensor Setup',
            heart:'No Sensor Setup',
            // led:'0',
            // sound:'0',
            // motion:'0',
            // temp: '0',
            // heart:'0',
    });
    const [displayDetails, setDisplayDetails] = useState([]);
    const [filterSensors, setFilterSensors] = useState([]);

    const handleInput = (e) =>{
        const {name, value} = e.target;
    
        setThingState(prevState =>({
            ...prevState,
            [name] : value
        }))
    }
    const addHandler = (e) => {
        setThingState(prevState =>({
            ...prevState,
            [e] : 'Sensor Added'
        }))
    }

    const ledHandler = (e) => {
        setThingState(prevState =>({
            ...prevState,
            led : 'Sensor Added'
        }))
    }


    useEffect(() => { // reloads only once 
        const filterList = async (e) => {
            const res = await axios.post("http://localhost:3011/getNoSetupDev", thingState);
            setFilterSensors(res.data)
        };
        filterList();
    }, []);

    console.log(filterSensors);

    const filtered = () => {
        
          return filterSensors.map(e => (
                <DropdownButton
                    alignRight
                    title="Sensors to Add Filtered"
                    id="dropdown-menu-align-right"
                    onSelect={addHandler}>

                    {   
                        Object.keys(e).forEach((key, index) => {
                        // console.log(e[key]); //work here
                    
                        if(e[key] === "No Sensor Setup")
                            console.log(key);
                                <Dropdown.Item eventKey={key} key={index} > {key} Sensor</Dropdown.Item>
                        })
                    }
                </DropdownButton>

            ))
    }

//     const filtered2 = () => {
        
//         return filterSensors.map(e => (

//             <div class="dropdown">
//                 <button class="btn btn-secondary dropdown-toggle" onSelect={addHandler2} type="button"  data-bs-toggle="dropdown" aria-expanded="false">
//                     Add filtered sensors
//                 </button>
//                 <ul class="dropdown-menu">
//                     {   
//                         Object.keys(e).forEach((key) => {
//                         if(e[key] === "No Sensor Setup")
//                             console.log(key);
                            
//                                 <>
//                                     <li class="dropdown-item" name={key}> {key} Sensor</li>
//                                 </>
//                         })

//                     }

//                 </ul>
//             </div>
//         ))
              
//   }


    const addSensor = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:3011/addSensor", thingState);
            
            if(res.status == 200)
            {
                setThingState({
                            user_id:'',
                            userName:'',
                            led:'0',
                            sound:'0',
                            motion:'0',
                            temp: '0',
                            heart:'0',
                            });
                navigate('/');
               
            }
            else{
                console.log(res);
            }
          }
          catch(err){
              console.log(err);
          }
    }
    const getAllDevices = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:3011/getDevices", thingState);
            if(res.status == 200)
            {
                setDisplayDetails(res.data);
            }
            else{
                console.log(Error);
            }
          }
          catch(err){
              console.log(err);
          }
    }

    return(
        <div>
            <form className="LRForm" onSubmit = {addSensor}>
                <div class='row p-2'>
                    <div class="col-4 col-md-6">
                        {/* userHash and userName */}
                        <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value={thingState.user_id|| ({userHash})}/>
                        <input className ="inputBox" name = 'userName' type="hidden"  onChange={handleInput} value={thingState.userName|| "Sample"}/>
                    
                        {/* led sensor switch */}
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" onChange={handleInput} role="switch" id="flexSwitchCheckDefault" name='led' value= 'Sensor Added' />
                            <label class="form-check-label" for="flexSwitchCheckDefault">Led Sensor</label>
                        </div>
                    </div>
                    <div class="col-8 col-md-6">
                        {/* not filtered dropdown */}
                        <DropdownButton    
                                title="Sensors to Add"
                                id="dropdown-menu-align-right"
                                onSelect={addHandler}
                                    >
                                        <Dropdown.Item eventKey="sound" >Sound Sensor</Dropdown.Item>
                                        <Dropdown.Item eventKey="motion" >Motion Sensor</Dropdown.Item>
                                        <Dropdown.Item eventKey="temp" >Temperature Sensor</Dropdown.Item>
                                        <Dropdown.Item eventKey="heart" >Heart Sensor</Dropdown.Item>
                                </DropdownButton>

                        {/*  filtered dropdown (not working) */}
                                {filtered()}

                    </div>
                </div>
            
            <div class="col-12">
               {/*  testing displays for changes */}
               <div class="card">
                <div class="card-body">
                    <h1> Testing display </h1>
                        <h4>Led sensor: {thingState.led}</h4>
                        <h4>Sound sensor: {thingState.sound}</h4>
                        <h4>Motion sensor: {thingState.motion}</h4>
                        <h4>Temp sensor: {thingState.temp}</h4>
                        <h4>Heart sensor: {thingState.heart}</h4>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button className="loginRegbuttons" type="submit"> Add Sensor </button>
            </div>            
            </form>


            {/* display all states of the thing of a user id */}
            <form className="LRForm" onSubmit = {getAllDevices}>
                <h1 className="header1">Display All Devices and States </h1>
                <h2>User_id: {thingState.user_id}</h2>
                <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value ={thingState.user_id|| ({userHash})}/>
                <button className="loginRegbuttons" type="submit"> Display all the devices </button>
            </form>

            <div>
                <h1> Testing display </h1>
                {displayDetails.map((e) => (
                    <>
                        <h2>thing_id: {e.thing_id}</h2>
                        <h2>user_id: {e.user_id}</h2>
                        <h2>username: {e.username}</h2>
                        <h2>Led sensor: {e.led}</h2>
                        <h2>Sound sensor: {e.sound}</h2>
                        <h2>Motion sensor: {e.motion}</h2>
                        <h2>Temp sensor: {e.temp}</h2>
                        <h2>Heart sensor: {e.heart}</h2>
                    </>
                        
                ))}
            </div>
        </div>
    )
}
export default SignIn;