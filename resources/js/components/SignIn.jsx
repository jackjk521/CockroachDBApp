import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';   
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

// export const userHash = 'secretHashHere'

const SignIn = ({userHash, ethState, setEthState}) => {
   const navigate = useNavigate();

   const [thingState, setThingState] = useState({
            user_id: userHash, 
            userName: 'Sample',
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

    useEffect(() => { // reloads only once 
        let cancel = false
        const filterList = async (e) => {
            const res = await axios.post("http://localhost:3011/getNoSetupDev", thingState);
            !cancel && setFilterSensors(res.data)
        };
        filterList();
        return () => {
            cancel = true
        }
    }, []);

    console.log(filterSensors);

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
        <div classnName="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={logout}> Logout </button>
            <div className="container-fluid m-5" style={{width: '500px'} }>
                <form className="LRForm" onSubmit = {addSensor}>
                    <div className='row p-2'>
                        <div className="col-4 col-md-6">
                            {/* userHash and userName */}
                            <input className ="inputBox" name = 'user_id' type="hidden"  onChange={handleInput} value={thingState.user_id|| ({userHash})}/>
                            <input className ="inputBox" name = 'userName' type="hidden"  onChange={handleInput} value={thingState.userName|| "Sample"}/>
                        
                            {/* led sensor switch */}
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" onChange={handleInput} role="switch" id="flexSwitchCheckDefault" name='led' value= 'Sensor Added' />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Led Sensor</label>
                            </div>
                        </div>
                        <div className="col-8 col-md-6">
                            {/*  filtered dropdown */}
                                {
                                    filterSensors.map((obj, index) => (
                                        <DropdownButton title="Sensors to Add Filtered" onSelect={addHandler} key = {index}>
                        
                                            {   
                                                Object.keys(obj).map((key, index) => {
                                                    return (obj[key] === 'No Sensor Setup') ? <Dropdown.Item eventKey={key} key={index}> {key} Sensor </Dropdown.Item> : null
                                                })
                                            }
                                        </DropdownButton>
                                    ))
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