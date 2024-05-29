// axiosService.js
import axios from 'axios';

const threadbagInstance = axios.create({
    baseURL: 'http://localhost:5001'
});

export default threadbagInstance;