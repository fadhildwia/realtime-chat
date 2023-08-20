import axios from "axios"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import styled from "styled-components"
import loader from "../assets/loader.gif"
import { setAvatarRoute } from "../utils/APIRoutes"
import { useNavigate } from "react-router-dom"

const SetAvatar = () => {
  const api = 'https://api.multiavatar.com'
  const navigate = useNavigate()

  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState()

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  useEffect(() => {
    if (!localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const getImage = async () => {
      const data = []
      for (let i = 0; i < 4; i++) {
        const response = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}.svg`, // Use .svg extension
          { responseType: "text" }
        );
        data.push(response.data)
      }
      setAvatars(data)
      setIsLoading(false)
    }

    getImage()
  }, [])

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar', toastOptions)
    } else {
      const user = await JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY))
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar]
      })

      if (data.isSet) {
        user.isAvatarImageSet = true
        user.avatarImage = data.image
        localStorage.setItem(import.meta.env.VITE_APP_LOCALHOST_KEY, JSON.stringify(user))
        navigate('/')
      } else {
        toast.error('Error setting avatar. Please try again', toastOptions)
      }
    }
  }

  return (
    <>
    {isLoading ? (
      <Container>
        <img src={loader} alt="loader" className="loader" />
      </Container>
    ) : (
      <Container>
        <div className="title-container">
          <h1>Pick an avatar as your profile picture</h1>
        </div>
        <div className="avatars">
          {avatars.map((item, i) => (
            <div key={i} className={`avatar ${selectedAvatar === i ? 'selected' : ''}`}>
              <img src={`data:image/svg+xml,${encodeURIComponent(item)}`} alt="avatar" onClick={() => setSelectedAvatar(i)} />
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile</button>
        <ToastContainer />
      </Container>
    )}
    </>
  )
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
    max-inline-size: 100%;
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
`

export default SetAvatar