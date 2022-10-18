import axios from "axios";

let restUrl = process.env.REACT_APP_BASE_URL;
let AccessToken = process.env.REACT_APP_ACCESS_TOKEN;

const instance = axios.create({
    baseURL: `${restUrl}`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AccessToken}`
    }
})

export default instance;