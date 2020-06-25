import React,{useState,useEffect} from 'react';

import {useLocation} from 'react-router-dom';
import io from 'socket.io-client';

import qs from 'query-string';

import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';


let socket;


const ROOT_CSS = css({
  height: 400,
  //width: 400
});



export default function Home(props) {
    const [messages, setmessages] = useState([]);
    const [newMessageText, setnewMessageText] = useState("new message")
    let location = useLocation();
    const ENDPOINT = "http://localhost:5000/";
    const {room,name} = qs.parse(location.search)
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('join',{name,room})
  }, [location])

  useEffect(() => {
      socket.on('message',(payload) => {
          setmessages([...messages,payload])
      })
  })
  

  function test(e){

}


  
    return <div>
        <h1>PAGE ACCUEIL {name}</h1>
      <button onClick={test} className="btn btn-success">CLICK</button>

      <div className="jumbotron mx-auto" style={{width:"80%"}}>


          
      <ScrollToBottom className={ROOT_CSS}>  

      {messages.length ===0 ? <h1 className="text-center">Aucun message</h1> : messages.map((val,index) => {
          return <div key={index} className={val.message.name === name ? "d-flex justify-content-end ": "d-flex justify-content-start"}>

              <div className={val.message.name === name ? "bg-success text-white": "bg-danger text-white"} style={{border:"solid",maxWidth:"",borderRadius:"20px"}} >
                <span>{val.message.name}</span> 
                <span className="mx-3">{val.message.createdAt}</span>
                <p>{val.message.text}</p>

              </div>
              

          </div>
      })}
      </ScrollToBottom>

               
      <form className="d-flex" onSubmit={e => {e.preventDefault(); setnewMessageText("")}}>
        <div style={{width:"100%"}} class="form-group">
            <input onKeyPress={e => {
                 const {room,name} = qs.parse(location.search)

                console.log(e.key);
                if(e.key === "Enter"){socket.emit('chatMessage',{text:newMessageText,sendeur:name})}

            }} type="text" class="form-control" value={newMessageText} onChange={e => setnewMessageText(e.target.value)} />
        </div>
      
        <button type="submit" class="btn btn-primary">Send</button>
    </form>


      </div>

      


    </div>;
  }