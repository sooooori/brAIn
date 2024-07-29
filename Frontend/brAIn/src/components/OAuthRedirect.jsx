import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthRedirect= () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');

        if (accessToken) {
            console.log('Access Token:', accessToken);

            // 현재 시간을 한국 시간대로 설정
            const expirationTimeAccess = new Date(new Date().getTime() + 10 * 60 * 1000); // 10분
            const expirationTimeAccessKST = new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Seoul'
            }).format(expirationTimeAccess);
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('accessTokenExpiration', expirationTimeAccessKST);

            window.location.href = 'http://localhost:5173/';
        } else {
            console.error('Access token not found');
            navigate('/loginoption');
        }
    }, [navigate]);

    return null;
};

export default OAuthRedirect;
