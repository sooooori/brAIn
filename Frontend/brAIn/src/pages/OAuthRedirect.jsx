import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice'; // Replace with your actual path

const OAuthRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOAuthRedirect = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);

                const accessToken = decodeURIComponent(urlParams.get('accessToken'));


                if (accessToken) {
 

                    const expirationTimeAccess = new Date(new Date().getTime() + 25 * 60 * 1000);
                    const expirationTimeAccessString = expirationTimeAccess.toISOString();
                    
                    // Store access token and expiration time in localStorage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('accessTokenExpiration', expirationTimeAccessString);

                    // Dispatch login action to update Redux state
                    dispatch(login({ accessToken }));

                    // Navigate to home page
                    navigate('/');
                } else {
                    console.log('Access token not found in URL parameters');
                    navigate('/loginoption');
                }
            } catch (error) {
                // Handle any errors that might occur during processing
                console.error('Error during OAuth redirect handling:', error);
                navigate('/loginoption');
            }
        };

        handleOAuthRedirect();
    }, [dispatch, navigate]);

    return null;
};

export default OAuthRedirect;
