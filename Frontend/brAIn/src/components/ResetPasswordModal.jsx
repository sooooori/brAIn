import { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/Axios'; // Import axios
import { useSelector } from 'react-redux';

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
    button: {
        marginTop: '10px',
        marginBottom: '10px',
    }
};

const ResetPasswordModal = ({ isOpen, onRequestClose, token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { accessToken } = useSelector((state) => state.auth);

    // Reset state when modal is closed
    const handleRequestClose = () => {
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setSuccessMessage('');
        onRequestClose();
    };

    // Handle resetting password
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:8080/api/v1/members/resetPassword',
                { password: newPassword }, // Body content
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            
            if (response.status === 200) {
                setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
                setErrorMessage('');
                handleRequestClose(); // Optionally close the modal after success
            } else {
                setSuccessMessage('');
                setErrorMessage('비밀번호 변경에 실패하였습니다.');
            }
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage('서버와의 연결에 문제가 발생하였습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleRequestClose}
            contentLabel="Reset Password Modal"
            style={customStyles}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>비밀번호 재설정</h1>
                <IconButton onClick={handleRequestClose} style={{ color: '#000' }}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div style={{ marginBottom: '20px' }}>
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
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </Modal>
    );
};

export default ResetPasswordModal;
