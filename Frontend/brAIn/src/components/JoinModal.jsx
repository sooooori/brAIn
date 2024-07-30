import { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailVerificationModal from './SendNumberModal'; // Import the EmailVerificationModal
import './JoinModal.css'; // Ensure this is correctly imported

// 모달 스타일 정의
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // 모달 창 너비 설정
        maxWidth: '500px', // 최대 너비 설정
        height: '80%', // 높이 자동 설정
        maxHeight: '500px', // 최대 높이 설정
        padding: '20px', // 패딩 설정
        borderRadius: '8px', // 모서리 둥글게 설정
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // 그림자 추가
        overflowY: 'auto', // 세로 스크롤 자동 추가
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 흐리게 설정
    }
};

const JoinModal = ({ isOpen, onRequestClose }) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        passwordCheck: '',
        emailVerificationCode: '',
    });

    const [errMsg, setErrMsg] = useState('');
    const [toggle, setToggle] = useState({
        emailIsValid: true,
        passwordIsValid: true,
        passwordCheckIsValid: true,
        emailVerificationIsValid: true,
    });

    const [serverVerificationCode, setServerVerificationCode] = useState('');
    const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] = useState(false);

    const emailRegex = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChangeUserInfo = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
        setToggle({
            ...toggle,
            emailIsValid: true,
            passwordIsValid: true,
            passwordCheckIsValid: true,
            emailVerificationIsValid: true,
        });
        setErrMsg('');
    };

    const handleSendVerificationCode = () => {
        if (!emailRegex.test(userInfo.email)) {
            setToggle({
                ...toggle,
                emailIsValid: false,
            });
            setErrMsg('올바르지 않은 이메일 양식입니다.');
            return;
        }

        axios.post('http://localhost:8080/api/v1/members/authNumber', {
            email: userInfo.email,
        })
        .then(response => {
            setServerVerificationCode(response.data.verificationCode);
            setErrMsg('인증번호가 이메일로 전송되었습니다.');
        })
        .catch(err => {
            console.error(err);
            setErrMsg('인증번호 전송 중 오류가 발생했습니다.');
        });
    };

    const handleVerifyCode = () => {
        if (userInfo.emailVerificationCode !== serverVerificationCode) {
            setToggle({
                ...toggle,
                emailVerificationIsValid: false,
            });
            setErrMsg('인증번호가 다릅니다.');
        } else {
            setToggle({
                ...toggle,
                emailVerificationIsValid: true,
            });
            setErrMsg('인증번호가 확인되었습니다.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailRegex.test(userInfo.email)) {
            setToggle({
                ...toggle,
                emailIsValid: false,
            });
            setErrMsg('올바르지 않은 이메일 양식입니다.');
            return;
        } else if (!passwordRegex.test(userInfo.password)) {
            setToggle({
                ...toggle,
                passwordIsValid: false,
            });
            setErrMsg('비밀번호는 영문, 숫자, 특수문자를 조합하여 최소 8자리 이상이여야 합니다.');
            return;
        } else if (userInfo.password !== userInfo.passwordCheck) {
            setToggle({
                ...toggle,
                passwordCheckIsValid: false,
            });
            setErrMsg('비밀번호가 일치하지 않습니다.');
            return;
        } else if (userInfo.emailVerificationCode !== serverVerificationCode) {
            setToggle({
                ...toggle,
                emailVerificationIsValid: false,
            });
            setErrMsg('인증번호가 일치하지 않습니다.');
            return;
        }

        axios
            .post('http://localhost:8080/api/v1/members/join', {
                email: userInfo.email,
                password: userInfo.password,
                name: userInfo.name,
            })
            .then(() => navigate('/'))
            .catch((err) => {
                console.error(err);
                setErrMsg('회원가입 중 오류가 발생했습니다.');
            });

        setUserInfo({
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
            emailVerificationCode: '',
        });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Join Modal"
                style={customStyles}
            >
                <div className="modal-header">
                    <IconButton onClick={onRequestClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="signup-wrapper">
                    <div className="signup-box">
                        <div className="header">
                            <img className="logo-img" src="images/brAIn_1.png" alt="brAIn" />
                            <div className="header-text">
                                <h1>brAIn</h1>
                                <p>AI와 함께하는 브레인스토밍</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="input-box">
                            <div className="input-field">
                                <label htmlFor="name">이름</label>
                                <TextField
                                    id="name"
                                    name="name"
                                    type="text"
                                    variant="outlined"
                                    value={userInfo.name}
                                    onChange={handleChangeUserInfo}
                                    placeholder="이름을 입력하세요."
                                    fullWidth
                                />
                            </div>
                            
                            <div className="input-field">
                                <label htmlFor="email">이메일</label>
                                <div className="textfield-wrapper">
                                    <TextField
                                        id="email"
                                        name="email"
                                        type="text"
                                        variant="outlined"
                                        value={userInfo.email}
                                        onChange={handleChangeUserInfo}
                                        placeholder="이메일을 입력하세요."
                                        fullWidth
                                    />
                                    <Button
                                        className="auth-button"
                                        onClick={handleSendVerificationCode}
                                        variant="contained"
                                    >
                                        인증번호 전송
                                    </Button>
                                </div>
                                {!toggle.emailIsValid && <div className="invalid-input">{errMsg}</div>}
                            </div>

                            <div className="input-field">
                                <label htmlFor="emailVerificationCode">인증번호</label>
                                <div className="textfield-wrapper">
                                    <TextField
                                        id="emailVerificationCode"
                                        name="emailVerificationCode"
                                        type="text"
                                        variant="outlined"
                                        value={userInfo.emailVerificationCode}
                                        onChange={handleChangeUserInfo}
                                        placeholder="인증번호를 입력하세요."
                                        fullWidth
                                    />
                                    <Button
                                        className="verify-button"
                                        onClick={handleVerifyCode}
                                        variant="contained"
                                    >
                                        인증하기
                                    </Button>
                                </div>
                                {!toggle.emailVerificationIsValid && <div className="invalid-input">{errMsg}</div>}
                            </div>
                            
                            <div className="input-field">
                                <label htmlFor="password">비밀번호</label>
                                <TextField
                                    id="password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    value={userInfo.password}
                                    onChange={handleChangeUserInfo}
                                    placeholder="비밀번호를 입력하세요."
                                    fullWidth
                                />
                                {!toggle.passwordIsValid && <div className="invalid-input">{errMsg}</div>}
                            </div>

                            <div className="input-field">
                                <label htmlFor="passwordCheck">비밀번호 확인</label>
                                <TextField
                                    id="passwordCheck"
                                    name="passwordCheck"
                                    type="password"
                                    variant="outlined"
                                    value={userInfo.passwordCheck}
                                    onChange={handleChangeUserInfo}
                                    placeholder="비밀번호를 다시 입력하세요."
                                    fullWidth
                                />
                                {!toggle.passwordCheckIsValid && <div className="invalid-input">{errMsg}</div>}
                            </div>
                            <Button
                                className="submit-button"
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                회원가입
                            </Button>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Email Verification Modal */}
            <EmailVerificationModal
                isOpen={isEmailVerificationModalOpen}
                onRequestClose={() => setIsEmailVerificationModalOpen(false)}
            />
        </>
    );
};

export default JoinModal;
