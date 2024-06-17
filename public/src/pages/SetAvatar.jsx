import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Buffer } from "buffer";
import { setAvatarRoute } from "../utils/APIRoutes";

function SetAvatar() {
  const api = `https://api.multiavatar.com/123456`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(async()=>{
    if(!localStorage.getItem("chat-app-user")){
        navigate('/login');
      }
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          if (response.status === 200) {
            const base64 = Buffer.from(response.data).toString("base64");
            data.push(base64);
          } else {
            throw new Error(`Failed to fetch avatar ${i}. Status: ${response.status}`);
          }
        }
        setAvatars(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching avatars:", error);
        toast.error("Failed to fetch avatars. Please try again later.", toastOptions);
        setLoading(false); // Ensure loading state is updated on error
      }
    };
  
    fetchData(); // Call the async function defined inside useEffect
  }, []);
  const setProfilePicture = async () => {
   if(selectedAvatar === undefined){
    toast.error("please select an avatar", toastOptions);
   }else{
    const user=await JSON.parse(localStorage.getItem("chat-app-user"));
    const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      
      console.log(data)
      if(data.isSet){
        user.isAvatarImageSet=true;
        user.avatarImage=data.image;
        localStorage.setItem("chat-app-user",JSON.stringify(user));
        navigate('/');
      }else{
        toast.error("error setting avatar",toastOptions)
      }
   }
  };
  return (
    <>
          {loading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) :(
      <Container>
        <div className="title-container">
          <h1>Pick an avatar as your profile picture</h1>
          <div className="avatars">
            {loading ? (
              <img src={loader} alt="Loading..." className="loader" />
            ) : (
              avatars.map((avatar, index) => (
                <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt={`Avatar ${index}`}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
      </Container>

        )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-width: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
.submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
export default SetAvatar;
