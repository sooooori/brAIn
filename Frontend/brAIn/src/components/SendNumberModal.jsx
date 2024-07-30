import { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/Axios';

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

const SendNumberModal = ({ isOpen, onRequestClose, onVerificationSuccess }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [serverVerificationCode, setServerVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Reset state when modal is closed
    const handleRequestClose = () => {
        setEmail('');
        setVerificationCode('');
        setServerVerificationCode('');
        setErrorMessage('');
        setSuccessMessage('');
        onRequestClose();
    };

    // Handle sending verification code
    const handleSendCode = async () => {
        if (!email) {
            setErrorMessage('이메일을 입력해주세요.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/v1/send-verification-code', { email });
            setServerVerificationCode(response.data.verificationCode);
            setErrorMessage('');
            setSuccessMessage('인증 코드가 이메일로 전송되었습니다.');
        } catch (error) {
            console.error(error);
            setErrorMessage('인증 코드 전송에 실패했습니다.');
            setSuccessMessage('');
        }
    };

    // Handle verifying the code
    const handleVerifyCode = () => {
        if (verificationCode !== serverVerificationCode) {
            setErrorMessage('인증 코드가 올바르지 않습니다.');
            setSuccessMessage('');
        } else {
            setErrorMessage('');
            setSuccessMessage('인증이 성공적으로 완료되었습니다.');
            onVerificationSuccess(); // Notify parent component of successful verification
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleRequestClose} // Use the updated function here
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
                    인증 코드 전송
                </Button>
            </div>
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
                >
                    인증 확인
                </Button>
            </div>
            {errorMessage && <p style={customStyles.errorText}>{errorMessage}</p>}
            {successMessage && <p style={customStyles.successText}>{successMessage}</p>}
        </Modal>
    );
};

export default SendNumberModal;
