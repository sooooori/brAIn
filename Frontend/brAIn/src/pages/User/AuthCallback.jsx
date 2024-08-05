import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/Axios';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLoginResponse = async (code, provider) => {
            try {
                const response = await axios.get(`http://localhost/api/v1/members/login/${provider}?code=${code}`);
                const { accessToken, message } = response.data;

                if (message === 'Login successful') {
                    localStorage.setItem('accessToken', accessToken);

                    const userResponse = await axios.get('http://localhost/api/v1/members/member', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    const userData = userResponse.data.member;
                    console.log(userData)
                    dispatch(login({
                        user: {
                            email: userData.email,
                            name: userData.name,
                            photo: userData.photo,
                            type: userData.social,
                        },
                        accessToken: accessToken
                    }));

                    navigate('/');
                } else {
                    console.error('Login failed: ', message);
                }
            } catch (error) {
                console.error('Error during login: ', error);
            }
        };

        const urlParams = new URLSearchParams(location.search);
        console.log(urlParams)
        const code = urlParams.get('code');
        const provider = location.pathname.includes('kakao') ? 'kakao' : 'google';

        const sessionKey = `${provider}CodeProcessed`;

        if (code && !sessionStorage.getItem(sessionKey)) {
            handleLoginResponse(code, provider);
            sessionStorage.setItem(sessionKey, 'true');
        }
    }, [location, navigate, dispatch]);

    return <div>Loading...</div>;
};

export default AuthCallback;
