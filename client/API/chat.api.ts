import axios from "axios"

export const getMessages = async() => {
    return await axios.get(`/messages`);
}

export const sendChat = () => {
    
}