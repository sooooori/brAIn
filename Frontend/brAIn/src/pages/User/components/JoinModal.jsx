import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../../../utils/Axios';
import { useNavigate } from 'react-router-dom';
import './JoinModal.css';

// 모달 스타일 정의
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
        height: '80%',
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

const JoinModal = ({ isOpen, onRequestClose }) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        passwordCheck: '',
        emailVerificationCode: '',
    });

    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [verificationErrMsg, setVerificationErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');
    const [passwordCheckErrMsg, setPasswordCheckErrMsg] = useState('');

    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const [isVerificationCodeResent, setIsVerificationCodeResent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isVerificationComplete, setIsVerificationComplete] = useState(false);
    const [emailDuplicateModalOpen, setEmailDuplicateModalOpen] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const emailRegex = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    useEffect(() => {
        let interval;
        if (isVerificationCodeSent && !isVerificationComplete) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setTimer(0);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isVerificationCodeSent, isVerificationComplete]);

    const handleChangeUserInfo = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
        setEmailErrMsg('');
        setVerificationErrMsg('');
        setPasswordErrMsg('');
        setPasswordCheckErrMsg('');
    };

    const handleSendVerificationCode = () => {
        if (!emailRegex.test(userInfo.email)) {
            setEmailErrMsg('올바르지 않은 이메일 양식입니다.');
            return;
        }

        axios.post('http://localhost/api/v1/members/sendAuthNumber', {
            email: userInfo.email,
        })
        .then(response => {
            console.log(response);
            setIsVerificationCodeSent(true);
            setIsVerificationCodeResent(true);
            setTimer(300); // 5분 = 300초
            setEmailErrMsg('인증번호가 전송되었습니다.'); // 인증번호 전송 완료 메시지
        })
        .catch(err => {
            console.error(err);
            setEmailErrMsg('인증번호 전송 중 오류가 발생했습니다.');
        });
    };

    const handleVerifyCode = () => {
        axios.post('http://localhost/api/v1/members/authNumber', {
            email: userInfo.email,
            code: userInfo.emailVerificationCode,
        })
        .then(response => {
            console.log(response);
            setIsVerificationComplete(true);
            setVerificationErrMsg('인증번호가 확인되었습니다.');
        })
        .catch(err => {
            console.error(err);
            setVerificationErrMsg('인증번호가 다릅니다.');
        });
    };

    const handleCheckEmailDuplicate = () => {
        if (!emailRegex.test(userInfo.email)) {
            setEmailErrMsg('올바르지 않은 이메일 양식입니다.');
            return;
        }

        axios.post('http://localhost/api/v1/members/checkEmail', 
            { email: userInfo.email }
        )
        .then(response => {
            console.log(response);
            if (response.status === 200) { // 이메일 중복 없음
<<<<<<< HEAD
                setEmailErrMsg('중복되지 않은 이메일입니다.' + userInfo.email);
=======
                setEmailErrMsg('중복되지 않은 이메일입니다.');
>>>>>>> feature/image
                setIsEmailChecked(true); // 이메일이 체크됨
            }
        })
        .catch(err => {
            console.error(err);
            if (err.response) {
                setEmailDuplicateModalOpen(true); // 이메일 중복 오류 모달 표시
            } else if (err.request) {
                setEmailErrMsg('이메일 중복 확인 중 오류가 발생했습니다.');
            } else {
                setEmailErrMsg('이메일 중복 확인 중 오류가 발생했습니다.');
            }
        });
    };

    const handleCloseEmailDuplicateModal = () => {
        setEmailDuplicateModalOpen(false);
    };

    const handleCloseJoinModal = () => {
        onRequestClose(); // JoinModal 닫기
        resetForm(); // 폼 상태 초기화
    };

    const handleCloseModal = () => {
        setEmailDuplicateModalOpen(false);
        onRequestClose();
        resetForm();
    };

    const resetForm = () => {
        setUserInfo({
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
            emailVerificationCode: '',
        });
        setEmailErrMsg('');
        setVerificationErrMsg('');
        setPasswordErrMsg('');
        setPasswordCheckErrMsg('');
        setIsVerificationCodeSent(false);
        setIsVerificationComplete(false);
        setIsEmailChecked(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailRegex.test(userInfo.email)) {
            setEmailErrMsg('올바르지 않은 이메일 양식입니다.');
            return;
        } else if (!passwordRegex.test(userInfo.password)) {
            setPasswordErrMsg('비밀번호는 영문, 숫자, 특수문자를 조합하여 최소 8자리 이상이여야 합니다.');
            return;
        } else if (userInfo.password !== userInfo.passwordCheck) {
            setPasswordCheckErrMsg('비밀번호가 일치하지 않습니다.');
            return;
        } else if (!isVerificationComplete) {
            setVerificationErrMsg('인증번호가 확인되지 않았습니다.');
            return;
        }

        axios
            .post('http://localhost/api/v1/members/join', {
                email: userInfo.email,
                password: userInfo.password,
                name: userInfo.name,
            })
            .then(() => handleCloseJoinModal()) // JoinModal 성공적으로 회원가입 후 닫기
            .catch((err) => {
                console.error(err);
                setEmailErrMsg('회원가입 중 오류가 발생했습니다.');
            });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={handleCloseJoinModal}
                contentLabel="Join Modal"
                style={customStyles}
            >
                <div className="modal-header">
                    <IconButton onClick={handleCloseJoinModal}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="signup-wrapper">
                    <div className="signup-box">
                        <div className="header">
                            <img className="logo-img-join" src="images/brAIn_1.png" alt="brAIn" />
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
                                    placeholder="이름을 입력해주세요."
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
                                        placeholder="이메일을 입력해주세요."
                                        fullWidth
                                        disabled={isVerificationComplete} // Disable the email input if verification is complete
                                    />
                                    {isEmailChecked ? (
                                        <Button
                                            className="auth-button"
                                            onClick={handleSendVerificationCode}
                                            variant="contained"
                                            disabled={isVerificationComplete} // Disable the button if verification is complete
                                        >
                                            {isVerificationCodeResent ? '인증번호 재전송' : '인증번호 전송'}
                                        </Button>
                                    ) : (
                                        <Button
                                            className="check-email-button"
                                            onClick={handleCheckEmailDuplicate}
                                            variant="contained"
                                            disabled={isVerificationComplete} // Disable the button if verification is complete
                                        >
                                            중복 확인
                                        </Button>
                                    )}
                                </div>
                                <div className={`status-message ${emailErrMsg ? 'invalid' : ''}`}>
                                    {emailErrMsg}
                                </div>
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
                                        placeholder="인증번호를 입력해주세요."
                                        fullWidth
                                        disabled={isVerificationComplete} // Disable the verification code input if verification is complete
                                    />
                                    <Button
                                        className="verify-button"
                                        onClick={handleVerifyCode}
                                        variant="contained"
                                        disabled={!isVerificationCodeSent || isVerificationComplete}
                                    >
                                        {isVerificationComplete ? '인증 완료' : '인증 하기'}
                                    </Button>
                                </div>
                                <div className={`status-message ${verificationErrMsg ? 'invalid' : ''}`}>
                                    {verificationErrMsg}
                                </div>
                                {!isVerificationComplete && isVerificationCodeSent && (
                                    <div className="timer">
                                        {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                                    </div>
                                )}
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
                                    placeholder="비밀번호를 입력해주세요."
                                    fullWidth
                                />
                                <div className={`status-message ${passwordErrMsg ? 'invalid' : ''}`}>
                                    {passwordErrMsg}
                                </div>
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
                                    placeholder="비밀번호를 다시 입력해주세요."
                                    fullWidth
                                />
                                <div className={`status-message ${passwordCheckErrMsg ? 'invalid' : ''}`}>
                                    {passwordCheckErrMsg}
                                </div>
                            </div>
                            <Button
                                className="submit-button"
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={!isVerificationComplete}
                            >
                                회원가입
                            </Button>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* 이메일 중복 확인 모달 */}
            <Modal
                isOpen={emailDuplicateModalOpen}
                onRequestClose={handleCloseEmailDuplicateModal}
                contentLabel="Email Duplicate Modal"
                style={customStyles}
            >
                <div className="modal-header">
                    <IconButton onClick={handleCloseEmailDuplicateModal}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="signup-wrapper">
                    <div className="signup-box">
                        <h2>이메일 중복 확인</h2>
                        <p>이미 존재하는 이메일입니다. 로그인 페이지로 이동하시겠습니까?</p>
                        <Button
                            className="login-button"
                            onClick={() => {
                                handleCloseModal(); // 모달 닫기
                                navigate('/loginoption'); // 로그인 페이지로 이동
                            }}
                            variant="contained"
                        >
                            로그인하기
                        </Button>
                        <Button
                            className="close-button"
                            onClick={handleCloseEmailDuplicateModal}
                            variant="outlined"
                            style={{ marginLeft: '8px' }}
                        >
                            닫기
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default JoinModal;
