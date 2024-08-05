import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/Axios';
import ResetPasswordModal from './ResetPasswordModal'; // Import ResetPasswordModal

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
    }
};

const SendNumberModal = ({ isOpen, onRequestClose }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const [isVerificationComplete, setIsVerificationComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

    const handleRequestClose = () => {
        setEmail('');
        setVerificationCode('');
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
        axios.post('http://localhost/api/v1/members/checkEmail', { email : email })
            .then(response => {
                console.log(response)
                if (response.data.message === 'Email check successfully') {
                    // If email exists, send the verification code
                    return axios.post('http://localhost/api/v1/members/sendAuthNumber', { email : email });
                } else {
                    // Email does not exist
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
                    // This is handled in the catch block above, so no need to set errorMessage here
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

        axios.post('http://localhost/api/v1/members/authNumber', {
            email,
            code: verificationCode,
        })
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

    const handlePasswordReset = () => {
        if (!verificationCode) {
            setErrorMessage('인증 코드를 입력해주세요.');
            return;
        }

        handleRequestClose();
        setIsResetPasswordModalOpen(true);
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
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={handleRequestClose}
                contentLabel="Send Number Modal"
                style={customStyles}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>인증 코드 전송</h1>
                    <IconButton onClick={handleRequestClose} style={{ color: '#000' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div style={{ marginBottom: '20px' }}>
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
                        {isVerificationCodeSent ? '인증 코드 재전송' : '인증 코드 전송'}
                    </Button>
                </div>
                {isVerificationCodeSent && (
                    <div style={{ marginBottom: '20px' }}>
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
                            disabled={isVerificationComplete}
                        >
                            인증 확인
                        </Button>
                        {isVerificationComplete && (
                            <Button 
                                onClick={handlePasswordReset} 
                                variant="contained" 
                                color="secondary"
                                style={customStyles.button}
                            >
                                비밀번호 재설정
                            </Button>
                        )}
                    </div>
                )}
                {errorMessage && <p style={customStyles.errorText}>{errorMessage}</p>}
                {successMessage && <p style={customStyles.successText}>{successMessage}</p>}
                {isVerificationCodeSent && !isVerificationComplete && (
                    <div className="timer">
                        {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                    </div>
                )}
            </Modal>

            {/* ResetPasswordModal */}
            <ResetPasswordModal
                isOpen={isResetPasswordModalOpen}
                onRequestClose={() => setIsResetPasswordModalOpen(false)}
                email={email}  // Pass email to ResetPasswordModal
            />
        </>
    );
};

export default SendNumberModal;
