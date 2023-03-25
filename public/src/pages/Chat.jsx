import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components';
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { allUsersRoute ,host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from "../components/Welcome"
import ChatContainer  from '../components/ChatContainer';
import {io} from 'socket.io-client';

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [currentUser,setCurrentUser] = useState(undefined);
  const [currentChat,setCurrentChat] = useState(undefined);

  useEffect( ()=>{
    //This useEffect is used to check if we have logged in user and
    //if there is then just set the current user to that user
    async function getUser()
    {
      if(!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      {
        navigate("/login");
      }
      else{
        setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)))
      }
    } 
    getUser();
   
  },[])

  //For Socket working we are using this useEffect

  useEffect(()=>{
    //if user then establish connection and emit the adduser and add to your map
       if(currentUser)
       {
        socket.current = io(host);
        socket.current.emit("add-user",currentUser._id);

       } 
  },[currentUser])

  //This effect is used to work on the current user and
  // if the current user is set then we will get the whole data
  //else we will send back to setAvatar to set the avatar image
  useEffect(()=>{
    async function currentUser1()
    {
      if(currentUser)
      { 
        if(currentUser.isAvatarImageSet)
        {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }
        else
        {
          navigate('/setavatar');
        }
  
      }
    }
    currentUser1();
    
  },[currentUser])
  const handleChatChange = (chat)=>{
    setCurrentChat(chat);
  }
  return (
    <>
    <Container>
          <div className='container'>
               <Contacts 
               contacts={contacts} 
               changeChat={handleChatChange} 
               />
               {
                 currentChat === undefined ?
                (<Welcome/>):
                //we will also send the current socket to show that connnection of socket
                (<ChatContainer currentChat = {currentChat} socket={socket}/>)
                               }

          </div>
    </Container>;
    </>
  )
}

const Container =styled.div`
        height:100vh;
        width:100vw;
        display:flex;
        flex-direction:column;
        justify-content:center;
        gap:1rem;
        align-items:center;
        background-color:#131324;
        .container{
          height:85vh;
          width:85vw;
          background-color:#00000076;
          display:grid;
          grid-template-columns:25% 75%;
          @media screen and (min-width:720px) and (max-width:1080px)
          {
            grid-template-columns:35% 65%;
          }
        }
`;
export default Chat;