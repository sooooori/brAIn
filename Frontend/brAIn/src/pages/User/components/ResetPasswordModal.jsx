import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate if you're using react-router for navigation

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
        maxWidth: '500px', // Adjusted width for modal
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        overflowY: 'auto',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    errorText: {
        color: '#ff5252',  // Red color for error messages
        fontSize: '14px',
        marginTop: '10px',
    },
    successText: {
        color: '#28a745',  // Green color for success messages
        fontSize: '14px',
        marginTop: '10px',
    },
    button: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    requirementText: {
        color: '#ff5252',  // Red color for requirement messages
        fontSize: '12px',
        marginTop: '5px',
    },
    resetPasswordHorizontal: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    }
};

const ResetPasswordModal = ({ isOpen, onRequestClose }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const [isVerificationComplete, setIsVerificationComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate(); // Hook for navigation

    const handleRequestClose = () => {
        setEmail('');
        setVerificationCode('');
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setSuccessMessage('');
        setIsVerificationCodeSent(false);
        setIsVerificationComplete(false);
        setTimer(0);
        onRequestClose();
    };

    const handleSendCode = () => {
        if (!email) {
            setErrorMessage('이메일을 입력해주세요.');
            return;
        }

        // Check if the email exists in the database
        axios.post('http://localhost/api/v1/members/resetEmail', { email: email })
            .then(response => {
                if (response.data.message === 'Email check successfully') {
                    // If email exists, send the verification code

                    return axios.post('http://localhost/api/v1/members/sendAuthNumber', { email });
                } else {
                    setErrorMessage('가입된 회원이 아닙니다.');
                    setSuccessMessage('');
                    throw new Error('Email not found');
                }
            })
            .then(() => {
                setIsVerificationCodeSent(true);
                setSuccessMessage('인증번호가 전송되었습니다.');
                setErrorMessage('');
                setTimer(300); // 5 minutes countdown
            })
            .catch(err => {
                if (err.message === 'Email not found') {
                    // Handle email not found
                } else {
                    if (err.response && err.response.status === 404) {
                        setErrorMessage('이메일 확인 중 오류가 발생했습니다.');
                    } else {
                        setErrorMessage('인증번호 전송 중 오류가 발생했습니다.');
                    }
                    setSuccessMessage('');
                }
            });
    };

    const handleVerifyCode = () => {
        if (!verificationCode) {
            setErrorMessage('인증 코드를 입력해주세요.');
            return;
        }

        axios.post('http://localhost/api/v1/members/authNumber', { email, code: verificationCode })
            .then(() => {
                setSuccessMessage('인증번호가 확인되었습니다.');
                setErrorMessage('');
                setIsVerificationComplete(true);
            })
            .catch(() => {
                setErrorMessage('인증번호가 다릅니다.');
                setSuccessMessage('');
            });
    };

    const handleResetPassword = () => {
        if (!newPassword || newPassword !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않거나 비밀번호를 입력하지 않았습니다.');
            return;
        }

        axios.put('http://localhost/api/v1/members/resetPassword', { email, newPassword })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage('비밀번호가 성공적으로 재설정되었습니다.');
                    handleRequestClose();
                    // Optionally handle user logout and redirect
                    navigate('/'); // Redirect to home or login page
                }
            })
            .catch(() => {
                setErrorMessage('비밀번호 재설정 중 오류가 발생했습니다.');
                setSuccessMessage('');
            });
    };

    useEffect(() => {
        let interval;
        if (isVerificationCodeSent && !isVerificationComplete) {
            interval = setInterval(() => {
                setTimer(prevTimer => {
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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleRequestClose}
            contentLabel="Reset Password Modal"
            style={customStyles}
        >
            <div>
                <h2>{isVerificationCodeSent && !isVerificationComplete ? '인증 코드 확인' : '비밀번호 재설정'}</h2>
                <div className="modal-header">
                    <IconButton onClick={handleRequestClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
            <div>
                {!isVerificationCodeSent ? (
                    <>
                        <TextField
                            id="email"
                            label="이메일"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            onClick={handleSendCode}
                            variant="contained"
                            color="primary"
                            style={customStyles.button}
                        >
                            인증 코드 전송
                        </Button>
                    </>
                ) : !isVerificationComplete ? (
                    <>
                        <TextField
                            id="verificationCode"
                            label="인증 코드"
                            type="text"
                            placeholder="인증 코드를 입력하세요"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            onClick={handleVerifyCode}
                            variant="contained"
                            color="primary"
                            style={customStyles.button}
                        >
                            인증 확인
                        </Button>
                        <div className="timer">
                            {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                        </div>
                    </>
                ) : (
                    <div style={customStyles.resetPasswordHorizontal}>
                        <TextField
                            id="newPassword"
                            label="새 비밀번호"
                            type="password"
                            placeholder="새 비밀번호를 입력하세요"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            id="confirmPassword"
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            onClick={handleResetPassword}
                            variant="contained"
                            color="primary"
                            style={customStyles.button}
                        >
                            비밀번호 재설정
                        </Button>
                    </div>
                )}
            </div>
            {errorMessage && <p style={customStyles.errorText}>{errorMessage}</p>}
            {successMessage && <p style={customStyles.successText}>{successMessage}</p>}
        </Modal>
    );
};

export default ResetPasswordModal;
