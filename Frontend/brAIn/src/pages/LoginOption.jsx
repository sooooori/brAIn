import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import JoinModal from '../components/JoinModal';

const LoginOption = () => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

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

    const goToGoogleLogin = () => {
        window.location.href = `http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth/redirect`;
    };

    const goToKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/oauth/callback&response_type=code`;
    };



    return (
        <div>
            <img src="images/brAIn_1.png" alt="brAIn" />
            <h1>brAIn</h1>
            <h3>AI와 함께하는 브레인스토밍</h3>
            <button onClick={openLoginModal}>계정으로 로그인</button>
            <button onClick={goToGoogleLogin}>구글 계정으로 로그인</button>
            <button onClick={goToKakaoLogin}>카카오톡 계정으로 로그인</button>
            <button onClick={openJoinModal}>회원가입</button>
    
            <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
            <JoinModal isOpen={isJoinModalOpen} onRequestClose={closeJoinModal} />
        </div>
    );
};

export default LoginOption;