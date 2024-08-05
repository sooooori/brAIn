import { useState } from 'react';
import LoginModal from './components/LoginModal';
import JoinModal from './components/JoinModal';
import './LoginOption.css';

const LoginOptions = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const REST_API_KEY_KAKAO = 'fea30b4314dd7be5eb36b76ffc59be39';
    const REDIRECT_URI_KAKAO = 'http://localhost/kakao-redirect';  // 프론트엔드 설정된 URL

    const REST_API_KEY_GOOGLE = '266096775787-0uivud8vsborpu2vje1vmpf5a41th71j.apps.googleusercontent.com';
    const REDIRECT_URI_GOOGLE = 'http://localhost/google-redirect';  // 프론트엔드 설정된 URL

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const openJoinModal = () => {
        setIsJoinModalOpen(true);
    };

    const closeJoinModal = () => {
        setIsJoinModalOpen(false);
    };

    const goToKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY_KAKAO}&redirect_uri=${REDIRECT_URI_KAKAO}`;
    };

    const goToGoogleLogin = () => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${REST_API_KEY_GOOGLE}&redirect_uri=${REDIRECT_URI_GOOGLE}&scope=openid%20email%20profile&prompt=select_account`;
    };

    return (
        <div className={`login-container ${isLoginModalOpen || isJoinModalOpen ? 'hide-logo' : ''}`}>
            <img src="images/brAIn_1_removebg.png" alt="brAIn" className="logo-image" />
            <div className="content-box">
                <h1>brAIn</h1>
                <h3>AI와 함께하는 브레인스토밍</h3>
                <button onClick={openLoginModal}>계정으로 로그인</button>
                <div className="login-buttons">
                    <button className="half-width-button google-button" onClick={goToGoogleLogin}>
                        <img src="images/google.png" alt="Google" className="button-icon" />
                        구글 계정으로 로그인
                    </button>
                    <button className="half-width-button kakao-button" onClick={goToKakaoLogin}>
                        <img src="images/kakao.png" alt="Kakao" className="button-icon" />
                        카카오톡 계정으로 로그인
                    </button>
                </div>
                <button onClick={openJoinModal}>회원가입하기</button>
            </div>
            <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
            <JoinModal isOpen={isJoinModalOpen} onRequestClose={closeJoinModal} />
        </div>
    );
};

export default LoginOptions;
