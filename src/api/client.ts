import axios from "axios"
export const TOKEN_KEY = "token"
export const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL
    }
)
api.interceptors.request.use((config) => {
    const myToken = localStorage.getItem(TOKEN_KEY)
    if (myToken)
        config.headers.Authorization = "Bearer " + myToken
    return config
})
api.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        if (error.config?.url !== "/auth/login")
            window.location.href = "/login"

    }
    return Promise.reject(error)
})