import "./App.css";
//We need to install socket.io-client in our react application, to get this import of io
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

//We pass the URL of our server we are running our socket on, inside the connect() method
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  //Created this state to show the chat box only if a user joins a room
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    //We can only join a Room if username input is not empty and room input is not empty
    if (username !== "" && room !== "") {
      //We use emit method to send some data to a socket event we are listening for in the backend. First argument is the event we want to send data to, second argument is the data
      //we want to send.
      //This is sending data from our front-end to our back-end we connected to in our io.connect on line 7.
      socket.emit("join_room", room);

      //We set show chat to be true as we have joined a room, so it should show us the chat in our ternary statement inside the return
      setShowChat(true);
    }
  };
  return (
    <div className="App">
      {/* We used a ternary operator on our use state to show the chat component if show chat variable is true, if it is false it will show us the inputs
      to enter username and room number to join a chat room */}
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join Chat</h3>
          {/* When a user enters a name into the input we want to change the state of the username to what the user enters */}
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          {/* When a user enters a room into the input we want to change the state of the room to what the user enters */}
          <input
            type="text"
            placeholder="Room ID"
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          ></input>
          <button onClick={joinRoom}>CONNECT</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
