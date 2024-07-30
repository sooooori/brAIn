// src/utils/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';

// 토큰 유효성 검사 함수
const isTokenExpired = (expirationTime) => {
    const now = new Date().getTime();
    return now > expirationTime;
};

// 토큰 갱신 요청 함수
const refreshAccessToken = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/members/refresh', null, {
            withCredentials: true // 쿠키를 포함하여 요청
        });
        const { accessToken } = response.data;

        const expirationTimeAccess = new Date(new Date().getTime() + 10 * 60 * 1000); // 10분 유효시간
        const expirationTimeAccessString = expirationTimeAccess.toISOString();
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('accessTokenExpiration', expirationTimeAccessString);

        return accessToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        return null;
    }
};

// Axios 인터셉터 설정
axios.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem('accessToken');
        const expirationTimeAccess = new Date(localStorage.getItem('accessTokenExpiration')).getTime();

        if (isTokenExpired(expirationTimeAccess)) {
            accessToken = await refreshAccessToken();
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
