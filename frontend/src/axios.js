import axios from "axios"

export const apiBaseUrl = "http://localhost:4000/"
export const webSocketBaseUrl = "http://localhost:5000/"
const instance = axios.create({
    baseURL: apiBaseUrl,
})

export default instance