import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.exchangerate-api.com/v4'
});

instance.interceptors.response.use(
    response => response,
    error => {
        console.error("Hata:", error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default instance;
