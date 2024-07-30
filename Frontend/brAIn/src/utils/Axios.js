import axios from 'axios';

axios.defaults.withCredentials = true;

// 요청 인터셉터: 모든 요청에 `accessToken` 추가
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 응답 인터셉터: 401 응답을 처리하여 새로운 `accessToken` 발급
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post('http://localhost:8080/api/v1/members/refresh', {}, { withCredentials: true });
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);

                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (err) {
                console.error('리프레시 토큰을 사용한 액세스 토큰 재발급 실패:', err);
                // 필요한 경우 로그아웃 처리 등을 수행
                // 예: window.location.href = '/loginoption';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;