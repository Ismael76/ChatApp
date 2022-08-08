import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

//We are going to be sending and recieving messages via socketio hence we need pass socketio as a prop from the place we created it (App.js in this case)
//We also need the usernames of the user and the room which we pass as a prop from App.js
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");

  //A list of all messages for our chat, we created a state so we can add to this array/list of messages and display all of the messages by mapping it inside or chat-body div.
  const [messageList, setMessageList] = useState([]);

  //We make the function asynchronous to update backend
  const sendMessage = async () => {
    // If message is not empty, we want to send message
    if (currentMessage !== "") {
      //We create an object for our message we want to send to our socket in the backend, this object contains all the information such as
      //name of the user, the message, the time message was created & the room the message was sent to.
      const messageData = {
        //We pass it room and username we got as props from App.js component
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      //Emit the message to the socket on the backend, we created an event called 'send_message' for our socket in the backend. We want to emit our message object to this.
      await socket.emit("send_message", messageData);

      //To see the messages on our own scree not just the others users screen, we must add the messages object to our list when we emit the data
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  //Whenever our socket changes, (when it recieves a message, or if a new user joins the room etc...) we want it to execute some code, so we use useEffect hook.
  useEffect(() => {
    //We can listen to socket events on the front-end similar to how we listened to it in the back-end as we imported the socket.io-client library which is the same library as socket.io just for the front-end.
    //The data parameter of our call back function is now data (which is the message) sent from the backend server socket.
    socket.on("receive_message", (data) => {
      //We want to store our messages inside our messageList array we created as a state, every new message we want to add to this list we want to add all the previous messages,
      //then also the new message at the end of this list.
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((message) => {
            //messageList holds each message as an object as this is what we passed to the backend on line 17, we can see it has a key of message which is the text of the message
            //So we use dot notation to access this text of the message directly and pass it into our element
            return (
              <div
                className="message"
                //We added a ternary statement to check if the username of the person accessing the socket on their browser, if it is them they get an id of 'you' the other people in the
                //room will get the id of 'other' we can use CSS to differentiate the texts in the chat using these ids.
                id={username === message.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <p>{message.time}</p>
                    <p>{message.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {/* Whenever user types a message into the input, we want to store this inside of our message state */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Enter Message"
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        ></input>
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
