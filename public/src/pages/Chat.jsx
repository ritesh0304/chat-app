import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Contacts from '../components/Contacts.jsx';
import axios from 'axios';
import { allUsersRoute } from '../utils/APIRoutes.js';

function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(JSON.parse(user));
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data);
          } catch (error) {
            console.error('Error fetching contacts:', error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("chat-app-user");
    navigate('/login');
  };

  return (
    <Container>
      <div className="container">
        {currentUser && (
          <>
            <Contacts contacts={contacts} currentUser={currentUser} />
            {/* <div className="logout">
              <button onClick={handleLogout}>Logout</button>
            </div> */}
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
    grid-template-columns: 40% 60%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 60% 40%;
    }
  }
`;

export default Chat;
