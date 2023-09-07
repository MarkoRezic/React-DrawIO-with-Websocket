import axios from "axios"

/*
export const apiBaseUrl = "http://localhost:4000/"
export const webSocketBaseUrl = "http://localhost:5000/"
*/

// alt origin
export const apiBaseUrl = "http://192.168.0.11:4000/"
export const webSocketBaseUrl = "http://192.168.0.11:5000/"

const instance = axios.create({
    baseURL: apiBaseUrl,
})

export default instance