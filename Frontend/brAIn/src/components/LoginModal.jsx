import { useState } from 'react';
import Modal from 'react-modal';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SendNumberModal from './SendNumberModal'; // Import the SendNumberModal
import ResetPasswordModal from './ResetPasswordModal'; // Import the ResetPasswordModal component
import JoinModal from './JoinModal'; // Import the JoinModal component

// Custom styles for the modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '500px',
        height: '60%',
        maxHeight: '500px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        overflowY: 'auto',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
};

const LoginModal = ({ isOpen, onRequestClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSendNumberModalOpen, setIsSendNumberModalOpen] = useState(false); // State for SendNumberModal
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false); // State for ResetPasswordModal
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // State for JoinModal

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loginAttempts >= 5) {
            setErrorMessage('! 비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 통해 재설정해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/v1/members/login', { email, password });
            // const { accessToken, refreshToken } = response.data;
            // Access Token 가져오기
            const { accessToken} = response.data;

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

            // Access Token 유효 기간 설정 (25분)
            // const expirationTimeAccess = new Date(new Date().getTime() + 25 * 60 * 1000);
            // const expirationTimeAccessString = expirationTimeAccess.toISOString();
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('accessTokenExpiration', expirationTimeAccessKST);

            // 쿠키 확인
            console.log('Refresh Token:', document.cookie);

            // Refresh Token 유효 기간 설정 (35분)
            // const expirationDateRefresh = new Date(new Date().getTime() + 35 * 60 * 1000);
            // Cookies.set('refreshToken', refreshToken);
            // Cookies.set('refreshToken', refreshToken, { expires: expirationDateRefresh });

            // 로그인 성공 후 메인 페이지로 이동
            navigate('/');
            onRequestClose();
        } catch (error) {
            console.error('로그인 실패:', error);
            setLoginAttempts(prevAttempts => prevAttempts + 1);

            if (loginAttempts + 1 >= 5) {
                setErrorMessage('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.');
            } else {
                setErrorMessage('로그인 정보가 올바르지 않습니다.');
            }
        }
    };

    const handlePasswordFind = () => {
        setIsSendNumberModalOpen(true); // Open SendNumberModal
    };

    const handleSignup = () => {
        setIsJoinModalOpen(true); // Open JoinModal
    };

    const handleVerificationSuccess = () => {
        setIsSendNumberModalOpen(false); // Close SendNumberModal
        setIsResetPasswordModalOpen(true); // Open ResetPasswordModal
    };

    // Reset state when LoginModal is closed
    const handleRequestClose = () => {
        setEmail('');
        setPassword('');
        setLoginAttempts(0);
        setErrorMessage('');
        setIsSendNumberModalOpen(false);
        setIsResetPasswordModalOpen(false);
        setIsJoinModalOpen(false); // Close JoinModal
        onRequestClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={handleRequestClose} // Use the updated function here
                contentLabel="Login Modal"
                style={customStyles}
            >
                <div className="modal-header">
                    <IconButton onClick={handleRequestClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit}>
                    <h2>로그인</h2>
                    
                    <div>
                        <label>이메일</label>
                        <br />
                        <input 
                            type="email" 
                            placeholder="이메일을 입력해주세요" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>비밀번호</label>
                        <br />
                        <input 
                            type="password" 
                            placeholder="비밀번호를 입력해주세요" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                    <Button type="submit" variant="contained">시작하기</Button>
                </form>
                <div>
                    <Button onClick={handlePasswordFind}>비밀번호 찾기</Button>
                    <Button onClick={handleSignup}>회원가입</Button>
                </div>
            </Modal>

            <SendNumberModal
                isOpen={isSendNumberModalOpen}
                onRequestClose={() => setIsSendNumberModalOpen(false)}
                onVerificationSuccess={handleVerificationSuccess} // Pass the callback to SendNumberModal
            />

            <ResetPasswordModal
                isOpen={isResetPasswordModalOpen}
                onRequestClose={() => setIsResetPasswordModalOpen(false)}
            />

            <JoinModal
                isOpen={isJoinModalOpen}
                onRequestClose={() => setIsJoinModalOpen(false)}
            />
        </>
    );
};

export default LoginModal;
