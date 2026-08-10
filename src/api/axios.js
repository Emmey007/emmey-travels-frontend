import axios from 'axios'
const BASE_URL = 'https://emmey-travels.vercel.app/api/v1'
export const publicInstance = axios.create({ baseURL: BASE_URL })
export const privateInstance = axios.create({ baseURL: BASE_URL })
privateInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})
