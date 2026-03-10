import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://142.93.217.78.nip.io/server/api',
    withCredentials: true
})

export default instance;
