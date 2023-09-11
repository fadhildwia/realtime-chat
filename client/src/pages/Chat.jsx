import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { allUsersRoute, host } from "../utils/APIRoutes"
import Contacts from "../components/Contacts"
import Welcome from "../components/Welcome"
import ChatContainer from "../components/ChatContainer"
import { io } from 'socket.io-client'
import { request } from "../configs/request"

const Chat = () => {
  const navigate = useNavigate()
  const socket = useRef()

  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [currentChat, setCurrentChat] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const functionCurrentUser = async () => {
      if (!localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)) {
        navigate('/login')
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)))
        setIsLoading(false)
      }
    }

    functionCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host, {
        withCredentials: true
      })
      socket.current.emit("add-user", currentUser._id)
    }
  }, [currentUser])

  useEffect(() => {
    const functionCurrentUser = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await request.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data.data)
        } else {
          navigate('/setAvatar')
        }
      }
    }

    if (currentUser) functionCurrentUser()
  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {!isLoading && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  )
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
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%
    }
  }
`

export default Chat