import React ,{useState} from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();  
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    console.log(id);
    toast.success("Created a new room");
  };

  const joinRoom = (e) => {
    if (!roomId || !username) {
      toast.error("Room ID and Username are required");
      return;
    }   

    //redirect to editor page
    navigate(`/editor/${roomId}`,{
        state:{
            username,

        }
    })
  }

  const handleInputEnter=(e)=>{
    // console.log("event",e.code);
    if (e.code === "Enter") {
      joinRoom();
    

    }
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="/pusrun.png" alt="code-sync" className="homePageLogo" />

        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>

        <div className="inputGroup">
          <input 
            type="text"
            placeholder="ROOM ID" 
            className="inputBox" 
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input 
            type="text" 
            placeholder="USERNAME" 
            className="inputBox" 
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💙 by <a href="https://github.com/rajat-28">Rajat Garg</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
