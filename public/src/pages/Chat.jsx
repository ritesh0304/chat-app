import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts.jsx";
import axios from "axios";
import { allUsersRoute, host } from "../utils/APIRoutes.js";
import Welcome from "../components/Welcome.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import { io } from 'socket.io-client';

function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(user));
        setIsLoaded(true);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser && currentUser.isAvatarImageSet) {
        try {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      } else if (currentUser) {
        navigate("/setAvatar");
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("chat-app-user");
    navigate("/login");
  };

  return (
    <Container>
      <div className="container">
        {currentUser && (
          <>
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChatChange}
            />
            {(isLoaded && currentChat === undefined) ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
            )}
          </>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  font-size: 14px;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 30% 70%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 25% 75%;
      font-size: 14px;
    }
  }
`;

export default Chat;
