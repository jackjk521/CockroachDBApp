import React from 'react';
// import '../../css/Things.css';

const Things = ({things, client}) => {
    const toggleButton = (thing) => {
        // console.log('toggle button clicked')
        // console.log((thing.led === '-1')? "1" : (parseInt(thing.led)? "0" : "1"))
        // client.publish("/test/led", "1");
        client.publish(`/${thing.name}/led`, (thing.led === '-1')? "1" : (parseInt(thing.led)? "0" : "1"))
        // console.log('published')
    }
   
    return (
        <div className='things'>
            {
                (things.length > 0)
                ? things.map(thing => (
                    <div key = {thing._id}>
                        <h1> Name: {thing.name} </h1>
                        <div className='modules'>
                            {(thing.led === 'null')? '' : (
                                <>
                                    <p> Light: {(thing.led === '-1')? 'not set' : thing.led} </p>
                                    <button onClick={() => toggleButton(thing)}> Toggle </button>
                                    <button> button </button>
                                </>
                            ) }
                            {(thing.sound === 'null')? '' : <p> Sound: {(thing.sound === '-1')? 'not set' : thing.sound} </p> }
                            {(thing.temp === 'null')? '' : <p> Temperature: {(thing.temp === '-1')? 'not set' : thing.temp} </p> }
                            {(thing.motion === 'null')? '' : <p> Motion: {(thing.motion === '-1')? 'not set' : thing.motion} </p> }
                            {(thing.heart === 'null')? '' : <p> Heart rate: {(thing.heart === '-1')? 'not set' : thing.heart} </p> }
                        </div>
                    </div>
                ))
                : <h1> No things </h1>
            }
        </div>
    );
}

export default Things;