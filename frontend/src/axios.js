import axios from "axios"

export const apiBaseUrl = "http://localhost:4000/"
const instance = axios.create({
    baseURL: apiBaseUrl,
})

export default instance