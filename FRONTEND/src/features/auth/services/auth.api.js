import axios from "axios"

const baseURL = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? ""
    : "https://hireready-36oz.onrender.com";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export async function register({username, email, password}) {
    try{
        const response = await api.post("/api/auth/register", {
            username, email, password
        })
        localStorage.setItem("token", response.data.token)  
        return response.data
    } catch(err){
        console.log(err)
    }
}

export async function login({ email, password}) {
    try{
        const response = await api.post("/api/auth/login", {
            email, password
        })
        localStorage.setItem("token", response.data.token) 
        return response.data
    } catch(err){
        console.log(err)
    }
}

export async function logout(){
    try{
        localStorage.removeItem("token") 
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch(err){
        console.log(err)
    }
}

export async function getMe(){
    try{
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch(err){
        console.log(err)
    }
}