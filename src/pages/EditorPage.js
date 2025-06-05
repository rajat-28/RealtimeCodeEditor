import React, { use, useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function EditorPage() {

  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
        socketRef.current = await initSocket();
        socketRef.current.on("connect_error", (err) => {handleErrors(err)});
        socketRef.current.on("connect_failed", (err) => {handleErrors(err)});

        function handleErrors(err) {
            console.log("Socket connection error", err);
            toast.error('Socket connection failed, try to refresh the page');
            reactNavigator("/");
        }
        socketRef.current.emit(ACTIONS.JOIN,{
            roomId, 
            username: location.state?.username,
        });

        socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
            if(username !== location.state?.username){
              toast.success(`${username} has joined the room`);
              console.log(`${username} has joined the room`);
            }
            setClients(clients); 
            socketRef.current.emit(ACTIONS.SYNC_CODE,{
                code: codeRef.current,
                socketId,
            })
        })

        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
            toast.success(`${username} has left the room`);
            setClients((prev)=>{
              return prev.filter(client => client.socketId !== socketId);
            });
        });
    }
    init();
    return () =>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

    }
  },[])

  

  if(!location.state) {
    return <Navigate to="/"  />
  }

  const copyRoomId = async () =>{
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    }catch(err){
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  const leaveRoom = () => {
      reactNavigator("/");
  }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/push_run.png" alt="logo" className="logoImage" />
          </div>
          <h3 className="asideHeading">Connected</h3>
          <div className="clientList">
            {
                clients.map((client)=>(
                    <Client key = {client.socketId} username={client.username}/>
                ))
            }
          </div>
        </div>
        <button className="btn copyBtn" onClick = {copyRoomId}>COPY ROOM ID</button>
        <button className="btn leaveBtn" onClick = {leaveRoom}>LEAVE</button>
      </div>
      <div className="editorWrap">
        <Editor socketRef = {socketRef} roomId = {roomId} onCodeChange = {(code)=>{codeRef.current = code}}/>
      </div>
    </div>
  );
}

export default EditorPage;
