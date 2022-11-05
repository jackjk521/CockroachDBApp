import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';   
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'


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

    useEffect(() => { // reloads only once 
        const filterList = async (e) => {
            const res = await axios.post("http://localhost:3011/getNoSetupDev", thingState);
            setFilterSensors(res.data)
        };
        filterList();
    }, []);

    console.log(filterSensors);

    const filtered = () => {
        
            filterSensors.map(e => (
                Object.keys(e).forEach((key) => {
                    console.log(e[key]); //work here
                    if(e[key] === "No Sensor Setup"){
                        <>
                            <Dropdown.Item eventKey={key}> {key} Sensor</Dropdown.Item>
                        </>
                    }
                })
            ))

        // const keys = Object.keys(filterSensors);

        // // print all keys

        // console.log(keys);

        // // iterate over object

        // keys.forEach((key, index) => {
        //     console.log(`${key}: ${filterSensors[key]}`);
        // });
    }


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
                <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value={thingState.user_id|| ({userHash})}/>
                <input className ="inputBox" name = 'userName' type="hidden"  onChange={handleInput} value={thingState.userName|| "Sample"}/>
                    <h1 className="header1">Add sensors</h1>
                    {/* <button className="button" name = 'sound' onClick={addHandler}>Add Sound Sensor</button> */}
             
                    <div className="App container">
      
                        <DropdownButton
                        alignRight
                        title="Sensors to Add"
                        id="dropdown-menu-align-right"
                        onSelect={addHandler}
                            >
                                <Dropdown.Item eventKey="sound" >Sound Sensor</Dropdown.Item>
                                <Dropdown.Item eventKey="motion" >Motion Sensor</Dropdown.Item>
                                <Dropdown.Item eventKey="temp" >Temperature Sensor</Dropdown.Item>
                                <Dropdown.Item eventKey="heart" >Heart Sensor</Dropdown.Item>
                        </DropdownButton>


                        <DropdownButton
                        alignRight
                        title="Sensors to Add Filtered"
                        id="dropdown-menu-align-right"
                        onSelect={addHandler}
                            >
                                {/* {filterSensors.map(({ name }) => name=> (
                                    <>
                                    <Dropdown.Item eventKey="sound" >Sound Sensor</Dropdown.Item>
                                    </>
                                ))} */}

                               

                             {filtered()}
     
                                
                        </DropdownButton>
                    </div>

                    <div>
                        <h1> Testing display </h1>
                        <h2>Led sensor: {thingState.led}</h2>
                        <h2>Sound sensor: {thingState.sound}</h2>
                        <h2>Motion sensor: {thingState.motion}</h2>
                        <h2>Temp sensor: {thingState.temp}</h2>
                        <h2>Heart sensor: {thingState.heart}</h2>
                    </div>

                <button className="loginRegbuttons" type="submit"> Add Sensor </button>
            </form>

            <form className="LRForm" onSubmit = {getAllDevices}>

                <h1 className="header1">Display All Devices and States</h1>
                <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value ={thingState.user_id|| ({userHash})}/>
                <h2>User_id: {thingState.user_id}</h2>
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

            <form className="LRForm" onSubmit = {getAllDevices}>

                <h1 className="header1">Display State</h1>
                <input className ="inputBox" name = 'userID' type="hidden"  onChange={handleInput} value={thingState.user_id|| ({userHash})}/>
                <button className="loginRegbuttons" type="submit"> Display all the devices and states </button>

            </form>
        </div>
    )
}
export default SignIn;