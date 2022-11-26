import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';   
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
// import * as mqtt from 'mqtt/dist/mqtt.min';
import Things from './Things';
import mqtt from 'mqtt'

const SignIn = ({userHash, ethState, setEthState}) => {
    const hash = sessionStorage.getItem('user_id');
    const navigate = useNavigate();
    const client = mqtt.connect("ws://34.209.25.168:9001", {   // replace the IP with your AWS instance public IP address
    username: "admin",  // your broker username
    password: "admin",   // your broker password
    }); 

   const [thingState, setThingState] = useState({
            user_id: hash, 
            name: "test",
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


    const [test, setTest] = useState([])
    const [things, setThings] = useState([])
    useEffect(async () => {
        const fun = async (topic, message) => {
            // console.log('message received')
          const topicArr = topic.split('/');
          const name = topicArr[1]
          const sensor = topicArr[2]
          const res = await axios.post(`http://localhost:3011/findThing`, {'name' : topicArr[1], user_id: hash});
        //   console.log("after getting devices: " );
        //   console.log(res.data);
          const msg = message.toString();
          if(res.status == 200) {
            await axios.post(`http://localhost:3011/updateSensor` , {'name' : topicArr[1], 'sensor' : topicArr[2], 'value' : msg, 'user_id': hash});
          }
          setTest({name, sensor, msg})
        }

        client.on('message', fun );
      }, []);
    
    useEffect(() => {
        // console.log(test.msg)
        let current = things 
        let x = current.find(thing => test.name === thing.name)
        // console.log(x)
        if(x) {
        x[test.sensor] = test.msg
        setThings([...things])
        }
    }, [test]);

    useEffect(async () => {
        // retrieves the user_id
        
        const req = {
            params : {
              user_id : hash
            }
          };
          
          console.log("Userhash in signin is: " + hash)

          // to get all the devices from thing Table of a user_id
          const res = await axios.get(`http://localhost:3011/getDevices`, {
            params: {
              user_id: thingState.user_id
            }
          } );
          console.log("from get devces")
          console.log(res.data)
          const thingList = res.data; // wont work since its not the only thing res.data
          setThings(thingList)
      
          const sensors = ['led', 'sound', 'temp', 'motion', 'heart'];
          thingList.map(thing => {
            sensors.forEach((sensor) => {
              if(thing[sensor] != 'null') {
                client.subscribe(`/${thing.name}/${sensor}`);
                console.log(`subscribed to /${thing.name}/${sensor}`);
              }
            });
          });
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
    
    // const addSensor = async (e) => {
    //     e.preventDefault();

    //     try{
    //         const res = await axios.post("http://localhost:3011/addSensor", thingState);
            
    //         if(res.status == 200)
    //         {
    //             setThingState({
    //                         user_id:'',
    //                         name:'',
    //                         led:'0',
    //                         sound:'0',
    //                         motion:'0',
    //                         temp: '0',
    //                         heart:'0',
    //                         });
    //             navigate('/');
               
    //         }
    //         else{
    //             console.log(res);
    //         }
    //       }
    //       catch(err){
    //           console.log(err);
    //       }
    // }
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

    const deleteTables = async () => {
        const res = await axios.post("http://localhost:3011/deleteAll");
        console.log(res.data)
    }

    return(
        <div className="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={logout}> Logout </button>
            <div className="container-fluid m-5" style={{width: '500px'} }>
            <button onClick={() => deleteTables()}> Delete </button>
            <Things things = {things} client = {client} />
                {/* <form className="LRForm" onSubmit = {addSensor}>
                    <div className='row p-2'>
                        <div className="col-4 col-md-6">
                 
                            <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value={thingState.user_id|| ({userHash})}/>
                            <input className ="inputBox" name = 'name' type="hidden"  onChange={handleInput} value={thingState.name|| "name"}/>
                        
                      
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" onChange={handleInput} role="switch" id="flexSwitchCheckDefault" name='led' value= 'Sensor Added' />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Led Sensor</label>
                            </div>
                        </div>
                        <div className="col-8 col-md-6">
                        
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

                <div className="card">
                    <div className="card-body">
                        <Things things = {things} client = {client} />
                        <h1> Testing display </h1>
                        <button onClick={() => deleteTables()}> Delete </button>
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
                </form>  */}


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