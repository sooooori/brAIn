import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthRedirect= () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');

        if (accessToken) {
            console.log('Access Token:', accessToken);

            const expirationTimeAccess = new Date(new Date().getTime() + 25 * 60 * 1000);
            const expirationTimeAccessString = expirationTimeAccess.toISOString();
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('accessTokenExpiration', expirationTimeAccessString);

            window.location.href = 'http://localhost:5173/';
        } else {
            console.error('Access token not found');
            navigate('/loginoption');
        }
    }, [navigate]);

    return null;
};

export default OAuthRedirect;
