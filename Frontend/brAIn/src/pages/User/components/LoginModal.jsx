import { useState } from 'react';
import Modal from 'react-modal';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../features/auth/authSlice';
import ResetPasswordModal from './ResetPasswordModal';
import JoinModal from './JoinModal';
import './LoginModal.css';

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
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loginAttempts >= 5) {
            setErrorMessage('! 비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 통해 재설정해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost/api/v1/members/login', { email, password });
            const { accessToken } = response.data;

            console.log('Login response:', response.data);

            if (!accessToken) {
                setErrorMessage('로그인 정보가 올바르지 않습니다.');
                return;
            }

            localStorage.setItem('accessToken', accessToken);
            if (accessToken) {
                const response = await axios.get('http://localhost/api/v1/members/member', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const userData = response.data;
                const userEmail = userData.member.email;
                const userName = userData.member.name;
                const userPhoto = userData.member.photo;
                const userType = userData.member.social;

                dispatch(login({
                    user: {
                        email: userEmail,
                        name: userName,
                        photo: userPhoto,
                        type : userType,
                    },
                    accessToken: accessToken
                }));
            }

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
        setIsResetPasswordModalOpen(true);
    };

    const handleSignup = () => {
        setIsJoinModalOpen(true);
    };

    const handleRequestClose = () => {
        setEmail('');
        setPassword('');
        setLoginAttempts(0);
        setErrorMessage('');
        setIsResetPasswordModalOpen(false);
        setIsJoinModalOpen(false);
        onRequestClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={handleRequestClose}
                contentLabel="Login Modal"
                style={customStyles}
            >
                <div className="modal-header">
                    <IconButton onClick={handleRequestClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>로그인</h2>
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="이메일을 입력해주세요."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                    <div className="modal-footer">
                        <Button type="submit" variant="contained" className="start-button">시작하기</Button>
                    </div>
                </form>
                <div className="modal-footer">
                    <Button onClick={handlePasswordFind} className="black-button">비밀번호 찾기</Button>
                    <Button onClick={handleSignup} className="black-button">회원가입</Button>
                </div>
            </Modal>

            <ResetPasswordModal
                isOpen={isResetPasswordModalOpen}
                onRequestClose={() => setIsResetPasswordModalOpen(false)}
                email={email} // Email 전달
            />

            <JoinModal
                isOpen={isJoinModalOpen}
                onRequestClose={() => setIsJoinModalOpen(false)}
            />
        </>
    );
};

export default LoginModal;
