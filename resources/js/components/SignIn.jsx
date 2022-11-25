import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';   
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import * as mqtt from 'mqtt/dist/mqtt'

const SignIn = ({userHash, ethState, setEthState}) => {
    const hash = sessionStorage.getItem('user_id');
    const navigate = useNavigate();
    const client = mqtt.connect("ws://34.209.25.168:9001", {   // replace the IP with your AWS instance public IP address
    username: "admin",  // your broker username
    password: "admin",   // your broker password
    }); 

   const [thingState, setThingState] = useState({
            user_id: hash, 
            name: "name",
            led:'0',
            sound:'0',
            motion:'0',
            temp: '0',
            heart:'0',
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

    const logout = () => {
        setEthState({...ethState, loggedIn: false})
    }

    useEffect(async () => {
        // retrieves the user_id
        
        const req = {
            params : {
              user_id : hash
            }
          };
          
          console.log("Userhash in signin is: " + hash)

          // to get all the devices from thing Table of a user_id
          const res = await axios.post(`http://localhost:3011/getDevices`, thingState);
          const thingList = res.data; // wont work since its not the only thing res.data
      
          const sensors = ['sound', 'temp', 'motion', 'heart'];
          thingList.map(thing => {
            sensors.forEach((sensor) => {
              if(thing[sensor] != 'null') {
                client.subscribe(`${thing.name}/${sensor}`);
                console.log(`subscribed to ${thing.name}/${sensor}`);
              }
            });
          });

          client.on('message', async function(topic, message) {
            const topicArr = topic.split('/');
          //   const res = await axios.get('findThing', {params: {'name' : topicArr[0]}});
            if(res.data.status == 200) {
              // const update = await axios.patch('updateThing', {'name' : topicArr[0], 'sensor' : topicArr[1], 'value' : message});
            }
          //   let current = things;
          //   current.find(thing => thing.name === topicArr[0])[topicArr[1]] = message;
          //   setThings([...current]);
          });
      
          // setThings(thingList);
    }, []);

  // dropdown filter 
    useEffect(() => {
      
        let cancel = false
        const filterList = async (e) => {
            const res = await axios.post("http://localhost:3011/getNoSetupDev", thingState);
            !cancel && setFilterSensors(res.data)
        };
        filterList();
        return () => {
            cancel = true
        }
    }, [])

    console.log(filterSensors);

    
    const addSensor = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:3011/addSensor", thingState);
            
            if(res.status == 200)
            {
                setThingState({
                            user_id:'',
                            name:'',
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
            const res = await axios.post("http://localhost:3011/getDevices", thingState.user_id);
            if(res.status == 200)
            {
                setDisplayDetails(res.data);
            }
            else{
                console.log([]);
            }
          }
          catch(err){
              console.log(err);
          }
    }

    return(
        <div classnName="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={logout}> Logout </button>
            <div className="container-fluid m-5" style={{width: '500px'} }>
                <form className="LRForm" onSubmit = {addSensor}>
                    <div className='row p-2'>
                        <div className="col-4 col-md-6">
                            {/* userHash , userName, name */}
                            <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value={thingState.user_id|| ({userHash})}/>
                            <input className ="inputBox" name = 'name' type="hidden"  onChange={handleInput} value={thingState.name|| "name"}/>
                        
                            {/* led sensor switch */}
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" onChange={handleInput} role="switch" id="flexSwitchCheckDefault" name='led' value= 'Sensor Added' />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Led Sensor</label>
                            </div>
                        </div>
                        <div className="col-8 col-md-6">
                            {/*  filtered dropdown */}
                                {
                                    (filterSensors.length != 0 )? (
                                        filterSensors.map((obj, index) => (
                                            <DropdownButton title="Sensors to Add Filtered" onSelect={addHandler} key = {index}>
                            
                                                {   
                                                    Object.keys(obj).map((key, index) => {
                                                        return (obj[key] === '0') ? <Dropdown.Item eventKey={key} key={index}> {key} Sensor </Dropdown.Item> : null
                                                    })
                                                }
                                            </DropdownButton>
                                        ))
                                    ) : (
                                            <DropdownButton title="Sensors Not Filtered" onSelect={addHandler} >
                                                <Dropdown.Item eventKey="sound" > Sound Sensor </Dropdown.Item>
                                                <Dropdown.Item eventKey="motion" > Motion Sensor </Dropdown.Item>
                                                <Dropdown.Item eventKey="temp" > Temperature Sensor </Dropdown.Item>
                                                <Dropdown.Item eventKey="heart" > Heart Sensor </Dropdown.Item>
                                            </DropdownButton>
                                    )
                                    
                                }
                        </div>
                    </div>
                
                <div className="col-12">
                {/*  testing displays for changes */}
                <div className="card">
                    <div className="card-body">
                        <h1> Testing display </h1>
                            <h4>Led sensor: {thingState.led}</h4>
                            <h4>Sound sensor: {thingState.sound}</h4>
                            <h4>Motion sensor: {thingState.motion}</h4>
                            <h4>Temp sensor: {thingState.temp}</h4>
                            <h4>Heart sensor: {thingState.heart}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-12">
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
        </div>
    )
}
export default SignIn;